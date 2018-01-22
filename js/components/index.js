var libraryComponents = {}
var CATALOG_FILE = 'catalog' // 文件夹
var libMixins = {}
var libFileType = ['doc', 'ppt', 'pdf', 'txt', 'excel', 'jpg', 'png', 'other']
libMixins.libClickHandler = {
  methods: {
    openPDFHandler: function(i) {
      var name = this.data[i].file_name
      var url = this.data[i].file_content
      _.openPDF(
        {
          loadurl: url,
          filetype: 'pdf',
          filetitle: name
        },
        this.openPDFSuccess,
        this.openPDFError
      )
    },
    openPDFSuccess: function(data) {},
    openPDFError: function(err) {
      mui.alert('打开该文件失败!', '提示', '确定')
    },
    postEmail: function(i) {
      console.log('post')
      var content_id = this.data[i].content_id
      var user_code = _.getStorage('user_code')
      _.getData(
        {
          appid: 'library',
          action: 'handler',
          params: {
            transtype: 'sendfilemail',
            content_id: content_id,
            user_code: user_code
          }
        },
        this.postMailSuc,
        this.postMailErr
      )
    },
    postMailSuc: function(data) {
      var lbToast = this.$refs.libToast
      lbToast.showToast()
      setTimeout(function() {
        lbToast.hideToast()
      }, 2000)
    },
    postMailErr: function(err) {
      var lbToast = this.$refs.libToastError
      lbToast.showToast()
      setTimeout(function() {
        lbToast.hideToast()
      }, 2000)
    }
  }
}
libraryComponents.LibLoading = {
  template: '<div class="lib-loading">\
              <img src="img/loading.gif" width="24" height="24">\
              <p class="lib-loading-desc">{{title}}</p>\
        </div>',

   props: {
     title: {
       type: String,
       default: '正在载入 ...'
     }
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
            <span class="time">{{getFormatTime}}</span>\
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
      var type = this.data.type,
        prefixSty = 'lib-type-'
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
    },
    getFormatTime: function() {
      var formatType = 'yyyy-MM-dd hh:ss'
      var date = new Date(Number(this.data.filetime.time))
      return _.formatDate(date, formatType)
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
                    <img :src="imgUrl" width="50" height="36" class="lib-toast-img" v-show="postSuccess === \'true\'"/>\
                    <img :src="imgUrl" width="25" height="36" class="lib-toast-img" v-show="postSuccess === \'error\'"/></div>\
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
    postSuccess: {
      type: String,
      default: 'true'
    }   
  },
  data: function() {
    return {
      isShowToast: false,
      email: 'wu**@yonyou.com'
    }
  },
  created: function(){
    var user_code = _.getStorage('user_code')
    if (user_code) {
      this.email = user_code+'@yonyou.com'
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
libraryComponents.LibNofileImg = {
  template:'<div class="lib-nofile-wrapper">\
         </div>',
      
}
libraryComponents.NetErrImg = {
  template:'<div class="lib-neterror-wrapper">\
         </div>',
      
}
var libCommonTemplate =  '<div class="lib-wrapper">\
<lib-header :title="preParentFile.file_name"></lib-header>\
<scroll-wrapper><div>\
<ul class="mui-table-view mui-table-view-chevron">\
<li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
    <list-item :data="item" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
</li></ul></div></div></scroll-wrapper>\
<div class="lib-nofile-container" v-show="!data.length"><lib-nofile-img></lib-nofile-img>\
<lib-toast ref="libToast" title="发送成功" post-success="true" img-url="img/success@2x.png"></lib-toast>\
<lib-toast ref="libToastError" img-url="img/error@2x.png" post-success="error" title="发送失败"></lib-toast>\
<keep-alive>\
    <transition name="lib-slide">\
        <router-view></router-view>\
    </transition>\
</keep-alive>\
</div>';
libMixins.commonComponents = {
  created: function() {
    _.getData(
      {
        appid: 'library',
        action: 'handler',
        params: {
          transtype: 'cataloglist',
          catalog_id: this.getItem.catalog_id
        }
      },
      this.callback,
      this.error
    )
    this.preParentFile = this.getItem||{}
  },
  methods: {
    callback: function(data) {
      if (!data.result) {
        mui.alert('返回的数据为空!!', '提示', '确定')
        return
      }
      this.data = data.result.catalog
    },
    error: function(err) {
      mui.alert('访问数据失败!', '提示', '确定')
    }
  },
  components: {
    ScrollWrapper: libraryComponents.ScrollWrapper,
    LibHeader: libraryComponents.LibHeader,
    ListItem: libraryComponents.ListItem,
    LibToast: libraryComponents.LibToast,
    LibNofileImg: libraryComponents.LibNofileImg
  }
}
// 二级页面
libraryComponents.SecondPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents], 
  template: libCommonTemplate,
  data: function() {
    return {
      data: [],
      preParentFile: {}
    }
  },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    }
  },
  methods: {
    clickItem: function(i) {
      if (this.$router.currentRoute.path === '/index/haschildren/haschildren'){
        return
      }
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      if (isCatalog === CATALOG_FILE) {
        this.$router.push({ path: '/index/haschildren/haschildren'})
      } else {
        this.openPDFHandler(i)
      }
    },
  }
}
// 三级页面

libraryComponents.ThirdPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: [],
      preParentFile: {}
    }
  },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    }
  },
  methods: {
    clickItem: function(i) {
      if (this.$router.currentRoute.path === '/index/haschildren/haschildren/haschildren'){
        return
      }
      console.log(3)
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      if (isCatalog === CATALOG_FILE) {
        this.$router.push({ path: '/index/haschildren/haschildren/haschildren' })
      } else {
       this.openPDFHandler(i)
      }
    }
  }
}
// 四级页面
libraryComponents.FouthPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: []
    }
  },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    }
  },
  methods: {
    clickItem: function(i) {
      if (this.$router.currentRoute.path === '/index/haschildren/haschildren/haschildren/haschildren'){
        return
      }
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      if (isCatalog === CATALOG_FILE) {
        this.$router.push({ path: '/index/haschildren/haschildren/haschildren/haschildren' })
      } else {
       this.openPDFHandler(i)
      }
    }
  }
}
// 五级页面
libraryComponents.FivePage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: []
    }
  },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    }
  },
  methods: {
    clickItem: function(i) {
      if (this.$router.currentRoute.path === '/index/haschildren/haschildren//haschildren/haschildren'){
        return
      }
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      if (isCatalog === CATALOG_FILE) {
        var currentRouter = this.$router.currentRoute.path
        var nextRouter = currentRouter+'/haschildren' 
        this.$router.push({ path: nextRouter })
      } else {
       this.openPDFHandler(i)
      }
    }
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
  data: function() {
    return {
      data: {}
    }
  },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject) {
        mui.alert('没有对用的数据', '提示', '确定')
      }
      this.data = item
      return item
    }
  }
}
