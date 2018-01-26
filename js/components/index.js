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
libraryComponents.LibSearchBtn = {
  template: '<div class="lib-searchbtn-wrapper" @click.stop="clickSearch">\
    <div class="content"><i class="mui-icon mui-icon-search lib-serach-icon"></i><span class="text">搜索</span></div>\
  </div>',
  methods: {
    clickSearch: function(){
      if (!event._constructed) {
        return
      }
      this.$emit('clicksearchbtn')
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
libraryComponents.ListItem = {
  template:
    '<div @click.stop="clickItem" class="lib-list-item">\
        <div class="lib-img-wrapper" :class="libGetCls"></div>\
        <div class="lib-img-content">\
            <h2 class="title" v-html="getFileName"></h2>\
            <span class="time">{{getFormatTime}}</span>\
        </div>\
        <i class="lib-right-icon" :class="libGetArrowCls" @click.stop="handlerEamil"></i>\
    </div>',
  props: {
    data: {
      type: Object,
      default: {}
    },
    searchval: ''
  },
  computed: {
    getFileName: function(){
      var name= this.data.file_name
      if (this.searchval) {
        var reg = new RegExp(this.searchval,'g')
        var markName = "<span style= 'color:#EB6964'>"+this.searchval+"</span>"
         name = name.replace(reg,markName)
      }
      return name
    },
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
      // 排除浏览器派发的事件
      if (!event._constructed) {
        return
      }
      this.$emit('listitemclick')
    },
    handlerEamil: function() {
      // 排除浏览器派发的事件
      if (!event._constructed) {
        return
      }
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
                    <img :src="imgUrl" width="10" height="50" class="lib-toast-img" v-show="postSuccess === \'error\'"/></div>\
                    <div class="lib-toast-title">{{title}}</div>\
                    <div class="lib-toast-email" v-show="postSuccess === \'error\'">{{email}}</div>\
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
      user_code = user_code.slice(0,2)+ '**'
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
<div class="scroll-wrapper lib-scroll-wrapper"><cube-scroll :data="data" :options="options">\
<ul class="mui-table-view mui-table-view-chevron">\
<li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
    <list-item :data="item" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
</li></ul></cube-scroll></div>\
<div class="lib-nofile-container" v-show="isNofile"><lib-nofile-img></lib-nofile-img></div>\
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
    clickItem: function(i) {
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      var currentRouter = this.$router.currentRoute.path
      if (isCatalog === CATALOG_FILE) {
        currentRouter = currentRouter+'/haschildren' 
        this.$router.push({ path: currentRouter })
      } else {
        currentRouter = currentRouter+'/hasnochild' 
        this.$router.push({ path: currentRouter })
      }
    },
    callback: function(data) {
      if (!data.result) {
        mui.alert('返回的数据为空!!', '提示', '确定')
        return
      }
      this.data = data.result.catalog
      if (this.data&&!this.data.length) {
        this.isNofile = true
      }
    },
    error: function(err) {
      mui.alert('访问数据失败!', '提示', '确定')
    }
  },
  components: {
    LibHeader: libraryComponents.LibHeader,
    ListItem: libraryComponents.ListItem,
    LibToast: libraryComponents.LibToast,
    LibNofileImg: libraryComponents.LibNofileImg
  }
}
libraryComponents.LibSearchLoading = {
  template: '<div class="lib-search-loading-wrapper">\
  <img src="img/loading.gif" width="24" height="24"><span class="text">努力搜索中...</span>\
  </div>'
}
// 二级页面
libraryComponents.SecondPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents], 
  data: function() {
    return {
      data: [],
      options: {
        click: true
      },
      isNofile: false,
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
    clickSearchBtn: function(){
      this.$router.push({path: '/haschildren/search'})
    }
  },
  components:{
    LibSearchBtn: libraryComponents.LibSearchBtn
  }
}
// 三级页面

libraryComponents.ThirdPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: [],
      options: {
        click: true
      },
      isNofile: false,
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
}
// 四级页面
libraryComponents.FouthPage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: [],
      options: {
        click: true
      },
      isNofile: false
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
}
// 五级页面
libraryComponents.FivePage = {
  mixins: [libMixins.libClickHandler,libMixins.commonComponents],
  template:libCommonTemplate,
  data: function() {
    return {
      data: [],
      options: {
        click: true
      },
      isNofile: false
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
  }
}
// 文档展示页
libraryComponents.OpenIframe = {
  template:
    '<div class="lib-wrapper">\
    <lib-header :title="getItem.file_name"></lib-header>\
    <div class="lib-scroll-wrapper"><div class="lib-iframe-wrapper"><iframe class="lib-open-iframe" :src="data.file_content"></iframe></div></div>\
</div>',
  components: {
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
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      this.data = item
      return item
    }
  }
}

libraryComponents.LibSearchPage = {
  mixins: [libMixins.libClickHandler],
  template: '<div class="lib-wrapper">\
  <div class="lib-search-header">\
    <div class="input-wrapper">\
    <div class="input-content">\
      <input placeholder="请输入关键字" type="text" v-model="inptVal" ref="inpt" @click="inptClick"/>\
      <i class="search-icon mui-icon mui-icon-search"></i>\
      <i class="delete-icon" @click.stop="deleteInpt"></i>\
      </div></div>\
   <span class="cancel-btn" @click.stop="turnBack">取消</span>\
  </div>\
  <div class="scroll-wrapper lib-scroll-wrapper"><cube-scroll ref="scroll" :data="data" :options="options" @pulling-up="onPullingUp">\
  <ul class="mui-table-view mui-table-view-chevron" v-show="data&&data.length">\
    <li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
      <list-item :data="item" :searchval="inptVal" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
    </li>\
  </ul>\
  <div class="lib-search-noresult" v-html="noresult" v-show="isNoresult"></div>\
  <div class="search-loading-wrapper" v-show="isShowLoading"><lib-search-loading></lib-search-loading></div>\
  </cube-scroll></div>\
  <keep-alive>\
  <transition name="lib-slide">\
      <router-view></router-view>\
  </transition>\
</keep-alive>\
  </div>',
  data: function(){
    return {
      inptVal:"",
      isShowLoading: false,
      data: [] ,
      pageindex: 1,
      isNoresult: false,
      options: {
        click: true,
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '',
            noMore: ''
          }
        }
      }
    }
  },
  mounted: function(){
    var that = this
    setTimeout(function(){
      that.$refs.inpt.click()
    },20)
  },
  computed: {
    noresult: function() {
      return '没有找到与“ <span style="color:#000">'+ this.inptVal + '</span> ” 相关内容'
    }
  },
  methods: {
    onPullingUp: function() {
     this.getRetData()
    },
    inptClick: function(){
      this.$refs.inpt.focus()
    },
    clickItem: function(i) {
      this.$refs.inpt.blur()
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      var currentRouter = this.$router.currentRoute.path
      if (isCatalog === CATALOG_FILE) {
        currentRouter = currentRouter+'/haschildren' 
        this.$router.push({ path: currentRouter })
      } else {
        currentRouter = currentRouter+'/hasnochild' 
        this.$router.push({ path: currentRouter })
      }
    },
    turnBack: function(){
      this.$refs.inpt.blur()
      this.$router.back()
    },
    deleteInpt: function(){
      this.inptVal = ""
    },
    getRetData: function(){
      _.getData(
        {
          appid: 'library',
          action: 'handler',
          params: {
            transtype: 'selectfile',
            select_file: this.inptVal,
            pageindex: this.pageindex
          }
        },
        this.callback,
        this.error
      )
    },
    callback: function(data){
      this.isShowLoading = false
     
      data = data.result.data
      if (data.length) {
        this.pageindex++
        this.isNoresult = false
        this.data = this.data.concat(data)
      } else {
        if (this.pageindex === 1) {
          this.isNoresult = true
        } else {
           mui.toast('没有更多的数据了!')
          this.$refs.scroll.forceUpdate(false)   
        }       
      }
    },
    error: function(err){
      this.isShowLoading = false
      mui.alert('访问数据失败!', '提示', '确定')
    }
  },
  watch: {
    inptVal: function(newVal){
      clearTimeout(this.timerIdL)
      this.isNoresult = false
      this.pageindex = 1
      this.data = []
      if(!this.inptVal){
        return
      }
      
      var that = this
      this.timerIdL = setTimeout(function(){
        clearTimeout(this.timerId)
        that.isShowLoading = true
        this.timerId = setTimeout(function(){
          that.getRetData()
        },200)
      },200)
    }
  },
  components: {
    LibHeader: libraryComponents.LibHeader,
    LibSearchLoading: libraryComponents.LibSearchLoading,
    ListItem: libraryComponents.ListItem
  },
}