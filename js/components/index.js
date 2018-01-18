var libraryComponents = {}
var CATALOG_FILE = 'catalog' // 文件夹
var libMixins = {}
var libFileType = [
    'doc','ppt','pdf','txt','excel','jpg','png','other'
]
libMixins.libClickHandler = {
    methods: {
        postEmail: function(i) {
            var content_id = this.data[i].content_id
            _.getData({
              appid: 'library',
              action: 'handler',
              params: {
                transtype: 'sendfilemail',
                content_id: content_id,
                user_code: 'wuyta'   
            }},this.postMailSuc,this.postMailErr)
          },
          postMailSuc: function(data){
            var lbToast = this.$refs.libToast
            lbToast.showToast()
            setTimeout(function(){
              lbToast.hideToast()
            },2000)
          },
          postMailErr: function(err){
            var lbToast = this.$refs.libToastError
            lbToast.showToast()
            setTimeout(function(){
              lbToast.hideToast()
            },2000)
          },
    }
}

libraryComponents.LibHeader = {
  template:
    '<header class="mui-bar mui-bar-nav lib-header">\
                <i class="mui-icon mui-icon-back" @click="turnBack"></i>\
                <h1 class="mui-title">{{title}}</h1>\
            </header>',
  props: {
    title: {
      type: String,
      default: '文库'
    }
  },
  methods: {
    turnBack: function() {
      this.$router.back()
    }
  }
}
//  scroll组件
libraryComponents.ScrollWrapper = {
  template:
    '<div class="lib-scroll-wrapper" ref="scrollWrapper">\
          <slot></slot>     \
      </div>',
  mounted: function() {
    var scrollWrapper = this.$refs.scrollWrapper
    var _self = this
    setTimeout(function() {
      _self.scroll = new BScroll(scrollWrapper, {
        click: true
      })
    }, 20)
  }
}
libraryComponents.ListItem = {
  template:
    '<div @click.stop="clickItem" class="lib-list-item">\
        <div class="lib-img-wrapper" :class="libGetCls"></div>\
        <div class="lib-img-content">\
            <h2 class="title">{{data.file_name}}</h2>\
            <span class="time">{{data.filetime}}</span>\
        </div>\
        <i class="lib-right-icon" :class="libGetArrowCls" @click.stop="handlerEamil"></i>\
    </div>',
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  computed: {
    libGetCls: function() {
      var type = this.data.type, prefixSty = 'lib-type-'
      if (type === 'file') {
        var fileType = this.data['file_type']
        return prefixSty + libFileType[fileType] 
      }
      return prefixSty + 'file'
    },
    libGetArrowCls: function() {
      var type = this.data.type,
        prefix = 'lib-type-'
      if (type === 'catalog') {
        return prefix + 'arrow'
      }
      return prefix + 'post'
    }
  },
  methods: {
    clickItem: function() {
      this.$emit('listitemclick')
    },
    handlerEamil: function() {
      var type = this.data.type
      if (type === 'catalog') {
        this.$emit('listitemclick')
      } else {
        this.$emit('postemail')
      }
    }
  }
}
libraryComponents.LibToast = {
  template:
    '<transition name="lib-toast"><div class="lib-wrapper-s" v-show="isShowToast"> \
                <div class="lib-toast-wrapper"> \
                    <div class="lib-toast-content">\
                    <div class="toast-img-wrapper">\
                        <img :src="imgUrl" width="50" height="36" class="img" v-show="isSuccess"/>\
                        <img :src="imgUrl" width="50" height="36" class="img" v-show="!isSuccess"/></div>\
                    <div class="lib-toast-title">{{title}}</div>\
                    <div class="lib-toast-email">{{email}}</div>\
                    </div>\
                </div>\
            </div></transition>',
  props: {
    imgUrl: {
      type: String,
      default: 'img/success@2x.png'
    },
    title: {
      type: String,
      default: '已发送到'
    },
    email: {
      type: String,
      default: 'wu**@yonyou.com'
    },
    isSuccess: {
        type: Boolean,
        default: true
    }
  },
  data: function() {
    return {
      isShowToast: false
    }
  },
  methods: {
    showToast: function() {
      this.isShowToast = true
    },
    hideToast: function() {
      this.isShowToast = false
    }
  }
}

// 二级页面
libraryComponents.SecondPage = {
mixins: [libMixins.libClickHandler],
  template:
    '<div class="lib-wrapper">\
        <lib-header :title="getItem.file_name"></lib-header>\
        <scroll-wrapper><div>\
        <ul class="mui-table-view mui-table-view-chevron">\
        <li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
            <list-item :data="item" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
        </li></ul></div></scroll-wrapper>\
        <lib-toast ref="libToast"></lib-toast>\
        <transition name="lib-slide">\
            <router-view></router-view>\
        </transition>\
    </div>',
  data: function() {
    return {
      data: {}
    }
  },
  created: function() {
      _.getData({
        appid: 'library',
        action: 'handler',
        params: {
          transtype: 'cataloglist',
          catalog_id: this.getItem.catalog_id
        }
      },this.callback,this.error)
  },
  computed: {
    getItem: function(){
        var item = this.$store.getters.currentLib
        if (_.isEmptyObject){
            mui.alert('没有对用的数据','提示','确定')
        }
        return item
    }
  },
  methods:{
    clickItem: function(i) {
        var isCatalog = this.data[i].type
        this.$store.commit(SET_CURRENT_ITEM, this.data[i])
        if (isCatalog === CATALOG_FILE) {
          this.$router.push({path:'/index/haschildren/haschildren'})
        }else {
         this.$router.push({path: '/index/haschildren/nochild'})
        }
      },
      callback: function(data) {
        if (!data.result) {
          mui.alert('返回的数据为空!!', '提示', '确定')
          return
        }
        data = data.result.catalog
        this.data = data
      },
      error: function(err) {
        mui.alert('访问数据失败!', '提示', '确定')
      },
  },
  components: {
    ScrollWrapper: libraryComponents.ScrollWrapper,
    LibHeader: libraryComponents.LibHeader,
    ListItem: libraryComponents.ListItem,
    LibToast: libraryComponents.LibToast
  }
}
// 三级页面

libraryComponents.ThirdPage = {
  template:
  '<div class="lib-wrapper">\
  <lib-header :title="getItem.file_name"></lib-header>\
  <scroll-wrapper><div>\
  <ul class="mui-table-view mui-table-view-chevron">\
  <li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
      <list-item :data="item" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
  </li></ul></div></scroll-wrapper>\
  <lib-toast ref="libToast"></lib-toast>\
  <transition name="lib-slide">\
      <router-view></router-view>\
  </transition>\
</div>',
data: function() {
    return {
      data: {}
    }
  },
  created: function() {
      _.getData({
        appid: 'library',
        action: 'handler',
        params: {
          transtype: 'cataloglist',
          catalog_id: this.getItem.catalog_id
        }
      },this.callback,this.error)
  },
  computed: {
    getItem: function(){
        var item = this.$store.getters.currentLib
        if (_.isEmptyObject){
            mui.alert('没有对用的数据','提示','确定')
        }
        return item
    }
  },
  methods:{
    clickItem: function(i) {
        var isCatalog = this.data[i].type
        this.$store.commit(SET_CURRENT_ITEM, this.data[i])
        if (isCatalog === CATALOG_FILE) {
          this.$router.push({path:'/index/haschildren/haschildren'})
        }else {
         this.$router.push({path: '/index/haschildren/nochild'})
        }
      },
      callback: function(data) {
        if (!data.result) {
          mui.alert('返回的数据为空!!', '提示', '确定')
          return
        }
        data = data.result.catalog
        this.data = data
      },
      error: function(err) {
        mui.alert('访问数据失败!', '提示', '确定')
      },
  },
  components: {
    ScrollWrapper: libraryComponents.ScrollWrapper,
    LibHeader: libraryComponents.LibHeader
  }
}
// 文档展示页
libraryComponents.OpenIframe = {
  template:
    '<div class="lib-wrapper">\
    <lib-header :title="getItem.file_name"></lib-header>\
    <scroll-wrapper><div class="lib-iframe-wrapper"><iframe class="lib-open-iframe" :src="data.file_content"></iframe></div></scroll-wrapper>\
</div>',
  components: {
    ScrollWrapper: libraryComponents.ScrollWrapper,
    LibHeader: libraryComponents.LibHeader
  },
  data: function(){
      return {
          data: {}
      }
  },
  computed: {
      getItem: function(){
          var item = this.$store.getters.currentLib
          if (_.isEmptyObject){
              mui.alert('没有对用的数据','提示','确定')
          }
          this.data = item
          return item
      }
  }
}
