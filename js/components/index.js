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
      this.isShowLoading = true
      var data = _.type(this.data) === 'array' ? this.data[i] : this.data
      var content_id = data.content_id
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
      this.isShowLoading = false
      var lbToast = this.$refs.postSuccess
      lbToast.show()
      setTimeout(function() {
        lbToast.hide()
      }, 2000)
    },
    postMailErr: function(err) {
      this.isShowLoading = false
      var lbToast = this.$refs.postError
      lbToast.show()
      setTimeout(function() {
        lbToast.hide()
      }, 2000)
    }
  }
}
libraryComponents.LibLoading = {
  template:
    '<div class="lib-loading">\
              <img :src="src" :width="width" :height="height">\
              <p class="lib-loading-desc" v-show="title">{{title}}</p>\
        </div>',

  props: {
    src: {
      type: String,
      default: 'img/loading.gif'
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    title: {
      type: String,
      default: '正在载入 ...'
    }
  }
}
libraryComponents.LibSearchBtn = {
  template:
    '<div class="lib-searchbtn-wrapper" @click.stop="clickSearch">\
    <div class="content"><i class="mui-icon mui-icon-search lib-serach-icon"></i><span class="text">搜索</span></div>\
  </div>',
  methods: {
    clickSearch: function() {
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
                <span v-if="isShowRight" @click.stop="clickRight" class="vote-header-right">{{righttext}}</span>\
            </header>',
  props: {
    isShowRight: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '文库'
    },
    righttext: {
      type: String,
      default: '转至邮箱'
    }
  },
  methods: {
    turnBack: function() {
      this.$router.back()
    },
    clickRight: function() {
      this.$emit('clickright')
    }
  }
}
libraryComponents.ListItem = {
  template:
    '<div><div @click.stop="clickItem" class="lib-list-item">\
        <div class="lib-img-wrapper" :class="libGetCls"></div>\
        <div class="lib-img-content">\
            <h2 class="title" v-html="getFileName"></h2>\
            <span class="time">{{getFormatTime}}</span>\
        </div></div>\
        <span v-if="data.type===\'catalog\'&&data.filenum" class="catalog-file-num">{{data.filenum}}</span>\
        <i class="lib-right-icon" v-if="data.type===\'catalog\'||data.file_type"  :class="libGetArrowCls" @click.stop="handlerEamil"></i>\
    </div>',
  props: {
    data: {
      type: Object,
      default: {}
    },
    searchval: ''
  },
  computed: {
    getFileName: function() {
      var name = this.data.file_name
      if (this.searchval) {
        var reg = new RegExp(this.searchval, 'g')
        var markName =
          "<span style= 'color:#EB6964'>" + this.searchval + '</span>'
        name = name.replace(reg, markName)
      }
      return name
    },
    libGetCls: function() {
      var type = this.data.type,
        prefixSty = 'lib-type-'
      if (type === 'file' || type === undefined) {
        var fileType = this.data['file_type']
        return prefixSty + libFileType[fileType]
      }
      return prefixSty + 'file'
    },
    libGetArrowCls: function() {
      var type = this.data.type,
        prefix = 'lib-type-'
      if (type === 'catalog') {
        return 'mui-icon mui-icon-arrowright lib-arrow-right'
      }
      return prefix + 'post'
    },
    getFormatTime: function() {
      var formatType = 'yy-MM-dd hh:ss'
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
libraryComponents.LibPostErr = {
  template:
    '<transition name="lib-toast"><div class="lib-wrapper-s" v-show="isShow"> \
  <div class="lib-toast-wrapper"> \
      <div class="lib-toast-content">\
        <div class="toast-img-wrapper">\
         <img src="img/error@2x.png" width="10" height="50" class="lib-toast-img"/>\
        </div>\
        <div class="lib-toast-title">{{title}}</div>\
      </div>\
  </div>\
</div></transition>',
  props: {
    title: {
      type: String,
      default: '发送失败 ！'
    }
  },
  data: function() {
    return {
      isShow: false
    }
  },
  methods: {
    show: function() {
      this.isShow = true
    },
    hide: function() {
      this.isShow = false
    }
  }
}
libraryComponents.LibPostSucc = {
  template:
    '<transition name="lib-toast"><div class="lib-wrapper-s" v-show="isShow"> \
                <div class="lib-toast-wrapper"> \
                    <div class="lib-toast-content">\
                    <div class="toast-img-wrapper">\
                    <img src="img/success@2x.png" width="50" height="36" class="lib-toast-img"/></div>\
                    <div class="lib-toast-title">{{title}}</div>\
                    <div class="lib-toast-email">{{email}}</div>\
                    </div>\
                </div>\
            </div></transition>',
  props: {
    title: {
      type: String,
      default: '已发送到'
    }
  },
  data: function() {
    return {
      isShow: false,
      email: 'wu**@yonyou.com'
    }
  },
  created: function() {
    var user_code = _.getStorage('user_code')
    if (user_code) {
      user_code = user_code.slice(0, 2) + '**'
      this.email = user_code + '@yonyou.com'
    }
  },
  methods: {
    show: function() {
      this.isShow = true
    },
    hide: function() {
      this.isShow = false
    }
  }
}
libraryComponents.LibNofileImg = {
  template: '<div class="lib-nofile-wrapper">\
         </div>'
}
libraryComponents.NetErrImg = {
  template: '<div class="lib-neterror-wrapper">\
         </div>'
}
var libCommonTemplate =
  '<div class="lib-wrapper">\
<lib-header :title="preParentFile.file_name"></lib-header>\
<div class="scroll-wrapper lib-scroll-wrapper"><cube-scroll :data="data" :options="options">\
<lib-search-btn @clicksearchbtn="clickSearchBtn"></lib-search-btn>\
<ul class="mui-table-view mui-table-view-chevron top-44">\
<li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
    <list-item :data="item" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
</li></ul></cube-scroll></div>\
<div class="lib-nofile-container" v-show="isNofile"><lib-nofile-img></lib-nofile-img></div>\
<lib-post-err ref="postError"></lib-post-err>\
<lib-post-succ ref="postSuccess"></lib-post-succ>\
<div class="lib-loading-post" v-show="isShowLoading">\
  <lib-loading title="" src="img/load.gif" :width="width" :height="height"></lib-loading>\
</div>\
<keep-alive>\
    <transition name="lib-slide">\
        <router-view></router-view>\
    </transition>\
</keep-alive>\
</div>'
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
  },
  methods: {
    clickSearchBtn: function() {
      var currentRouter = this.$router.currentRoute.path
      currentRouter = currentRouter + '/search'
      this.$router.push({ path: currentRouter })
    },
    clickItem: function(i) {
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      var currentRouter = this.$router.currentRoute.path
      if (isCatalog === CATALOG_FILE) {
        currentRouter = currentRouter + '/haschildren'
        this.$router.push({ path: currentRouter })
      } else {
        currentRouter = currentRouter + '/hasnochild'
        this.$router.push({ path: currentRouter })
      }
    },
    callback: function(data) {
      if (!data.result) {
        mui.alert('返回的数据为空!!', '提示', '确定')
        return
      }
      this.data = data.result.catalog
      if (this.data && !this.data.length) {
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
    LibPostErr: libraryComponents.LibPostErr,
    LibPostSucc: libraryComponents.LibPostSucc,
    LibNofileImg: libraryComponents.LibNofileImg,
    LibSearchBtn: libraryComponents.LibSearchBtn,
    LibLoading: libraryComponents.LibLoading,
  }
}
libraryComponents.LibSearchLoading = {
  template:
    '<div class="lib-search-loading-wrapper">\
  <img src="img/loading.gif" width="24" height="24"><span class="text">努力搜索中...</span>\
  </div>'
}
// 二级页面
libraryComponents.SecondPage = {
  mixins: [libMixins.libClickHandler, libMixins.commonComponents],
  template: libCommonTemplate,
  data: function() {
    return {
      data: [],
      isShowLoading: false,
      width: 70,
      height: 70,
      options: {
        click: true
      },
      isNofile: false,
      preParentFile: {}
    }
  },
  created: function() {
   this.preParentFile = this.$store.getters.currentLib
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
    clickSearchBtn: function() {
      debugger
      this.$router.push({ path: '/haschildren/search' })
    }
  },
  components: {
    LibSearchBtn: libraryComponents.LibSearchBtn
  }
}
// 三级页面

libraryComponents.ThirdPage = {
  mixins: [libMixins.libClickHandler, libMixins.commonComponents],
  template: libCommonTemplate,
  data: function() {
    return {
      data: [],
      isShowLoading: false,
      width: 70,
      height: 70,
      options: {
        click: true
      },
      isNofile: false,
      preParentFile: {}
    }
  },
  created: function() {
    this.preParentFile = this.$store.getters.currentLib
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
// 四级页面
libraryComponents.FouthPage = {
  mixins: [libMixins.libClickHandler, libMixins.commonComponents],
  template: libCommonTemplate,
  data: function() {
    return {
      data: [],
      isShowLoading: false,
      width: 70,
      height: 70,
      options: {
        click: true
      },
      isNofile: false,
      preParentFile: {}
    }
  },
  created: function() {
    this.preParentFile = this.$store.getters.currentLib
   },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    },
    preParentFile: function() {
      return this.$store.getters.currentLib
    }
  }
}
// 五级页面
libraryComponents.FivePage = {
  mixins: [libMixins.libClickHandler, libMixins.commonComponents],
  template: libCommonTemplate,
  data: function() {
    return {
      data: [],
      isShowLoading: false,
      width: 70,
      height: 70,
      options: {
        click: true
      },
      isNofile: false,
      preParentFile: {}
    }
  },
  created: function() {
    this.preParentFile = this.$store.getters.currentLib
   },
  computed: {
    getItem: function() {
      var item = this.$store.getters.currentLib
      if (_.isEmptyObject(item)) {
        mui.alert('没有对应的数据', '提示', '确定')
      }
      return item
    },
    preParentFile: function() {
      return this.$store.getters.currentLib
    }
  }
}
// 文档展示页
libraryComponents.OpenIframe = {
  mixins: [libMixins.libClickHandler],
  template:
    '<div class="lib-wrapper">'+
      '<lib-post-err ref="postError"></lib-post-err>'+
        '<lib-post-succ ref="postSuccess"></lib-post-succ>'+
    '<header class="open-iframe-wrapper">'+
      '<i class="mui-icon mui-icon-back" @click.stop="turnBack"></i>'+
      '<h2 class="title">{{getItem.file_name}}</h2>'+
      '<span class="text" @click.stop="postEmail">转至邮箱</span>'+
    '</header> '+
    '<div class="lib-loading-post" v-show="isShowLoading">'+
      '<lib-loading title="" src="img/load.gif" :width="width" :height="height"></lib-loading>'+
    '</div>'+
    '<div class="lib-scroll-wrapper">'+
    '<div class="lib-iframe-wrapper"><iframe class="lib-open-iframe" :src="data.file_content"></iframe></div>'+
    '</div>'+
'</div>',
  data: function() {
    return {
      data: {},
      isShowLoading: false,
      width: 70,
      height: 70,
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
  },
  methods: {
    turnBack: function(){
      this.$router.back()
    }
  },
  components: {
    LibHeader: libraryComponents.LibHeader,
    LibPostErr: libraryComponents.LibPostErr,
    LibPostSucc: libraryComponents.LibPostSucc,
    LibLoading: libraryComponents.LibLoading,
  }
}

libraryComponents.LibSearchPage = {
  template:
    '<div class="lib-wrapper">\
  <div class="lib-search-header">\
    <div class="input-wrapper">\
    <div class="input-content">\
      <input placeholder="请输入关键字" type="text" @click.stop="clickInpt" v-model="inptVal" ref="inpt"/>\
      <i class="search-icon mui-icon mui-icon-search"></i>\
      <i class="delete-icon" @click.stop="deleteInpt"></i>\
      </div></div>\
   <span class="cancel-btn" @click.stop="turnBack">取消</span>\
  </div>\
  <div class="scroll-wrapper lib-scroll-wrapper" @click.stop="blurInpt"><cube-scroll ref="scroll" :data="data" :options="options" @pulling-up="onPullingUp">\
  <ul class="mui-table-view mui-table-view-chevron" v-show="data&&data.length">\
    <li class="mui-table-view-cell lib-list-item-wrapper" v-for="(item,index) in data">\
      <list-item :data="item" :searchval="inptVal" @listitemclick="clickItem(index)" @postemail="postEmail(index)"></list-item>\
    </li>\
  </ul>\
  </cube-scroll></div>\
  <div class="lib-search-noresult" v-html="noresult" v-show="isNoresult"></div>\
  <div class="search-loading-wrapper" v-show="isShowLoading"><lib-search-loading></lib-search-loading></div>\
  <lib-post-err ref="postError"></lib-post-err>\
  <lib-post-succ ref="postSuccess"></lib-post-succ>\
  <keep-alive>\
  <transition name="lib-slide">\
      <router-view></router-view>\
  </transition>\
</keep-alive>\
  </div>',
  data: function() {
    return {
      inptVal: '',
      isShowLoading: false,
      data: [],
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
  mounted: function() {
    var that = this
    setTimeout(function(){
      that.$refs.inpt.click()
    },20)
  },
  computed: {
    noresult: function() {
      return (
        '没有找到与“ <span style="color:#000">' +
        this.inptVal +
        '</span> ” 相关内容'
      )
    }
  },
  methods: {
    clickInpt: function() {
      this.$refs.inpt.focus()
    },
    blurInpt: function() {
      this.$refs.inpt.blur()
    },
    postEmail: function(i) {
      var data = _.type(this.data) === 'array' ? this.data[i] : this.data
      var content_id = data.content_id
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
      this.$refs.inpt.blur()
      var lbToast = this.$refs.postSuccess
      lbToast.show()
      setTimeout(function() {
        lbToast.hide()
      }, 2000)
    },
    postMailErr: function(err) {
      var lbToast = this.$refs.postError
      lbToast.show()
      setTimeout(function() {
        lbToast.hide()
      }, 2000)
    },
    onPullingUp: function() {
      // 第一次加载后,并且有值才允许上拉
      if (this.data.length) {
        this.getRetData()
      } else {
        this.$refs.scroll.forceUpdate(false)
      }
    },
    clickItem: function(i) {
      this.$refs.inpt.blur()
      var isCatalog = this.data[i].type
      this.$store.commit(SET_CURRENT_ITEM, this.data[i])
      var currentRouter = this.$router.currentRoute.path
      if (isCatalog === CATALOG_FILE) {
        currentRouter = currentRouter + '/haschildren'
        this.$router.push({ path: currentRouter })
      } else {
        currentRouter = currentRouter + '/hasnochild'
        this.$router.push({ path: currentRouter })
      }
    },
    turnBack: function() {
      this.$refs.inpt.blur()
      this.$router.back()
    },
    deleteInpt: function() {
      this.inptVal = ''
    },
    getRetData: function() {
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
    callback: function(data) {
      this.isShowLoading = false
      data = data.result.data
      if (data.length) {
        this.pageindex++
        this.isNoresult = false
        if (this.inptVal) {
          this.data = this.data.concat(data)
        }
      } else {
        if (this.pageindex === 1) {
          this.isNoresult = true
        } else {
          mui.toast('没有更多的数据了!')
        }
        this.$refs.scroll.forceUpdate(false)
      }
    },
    error: function(err) {
      this.isShowLoading = false
      mui.alert('访问数据失败!', '提示', '确定')
    }
  },
  watch: {
    inptVal: function(newVal) {
      clearTimeout(this.timerIdL)
      var that = this
      this.isNoresult = false
      this.pageindex = 1
      this.data = []
      this.timerIdL = setTimeout(function() {
        if (!that.inptVal) {
          return
        }
        that.isShowLoading = true
        that.getRetData()
      }, 300)
    }
  },
  components: {
    LibHeader: libraryComponents.LibHeader,
    LibSearchLoading: libraryComponents.LibSearchLoading,
    ListItem: libraryComponents.ListItem,
    LibPostErr: libraryComponents.LibPostErr,
    LibPostSucc: libraryComponents.LibPostSucc,
  }
}
