summerready = function() {
  new Vue({
    el: '#app',
    router: libraryRouter,
    store: libVuexStore,
    mixins: [libMixins.libClickHandler],
    created: function() {
     _.getUserInfo(this.storeUserInfo,this.getUserInfoErr)
    },
    data: {
      data: [],
      isShowLoading: true,
      userCode: '',
      isError: false,
      isNoFile: false
    },
    mounted: function() {
      var _self = this
      var reg = /\/haschildren/
      _.onWatchBackBtn(function(){
        if (reg.test(location.href)) {
          _self.$router.back()
        } else {
          _self.exitApp()
        }     
      })
      setTimeout(function(){
        _self.scroll = new BScroll(_self.$refs.bsWrapper,{
          click: true
        })
      },20)
      // setTimeout(function() {
    //     mui.init({
    //       pullRefresh: {
    //         container: '#refreshContainer',
    //         down: {
    //           height: '50px',
    //           auto: false,
    //           height: 60,
    //           contentdown: '下拉可以刷新',
    //           contentover: '释放立即刷新',
    //           contentrefresh: '正在刷新...',
    //           auto: false,
    //           callback: function() {
    //             console.log(1)
    //             setTimeout(function() {
    //               mui('#refreshContainer')
    //                 .pullRefresh()
    //                 .endPulldownToRefresh()
    //               mui.toast('刷新成功')
    //             }, 1000)
    //           }
    //         },
    //         up: {
    //           height: 50,
    //           auto: false,
    //           contentrefresh: '正在加载...',
    //           contentnomore: '没有更多数据了',
    //           callback: function() {
    //             setTimeout(function() {
    //               // 没有更多数据的时候传true
    //               mui('#refreshContainer')
    //                 .pullRefresh()
    //                 .endPullupToRefresh(true)
    //             }, 1000)
    //           }
    //         }
    //       }
    //     })
    //   }, 20)
     },
    methods: {
      openRequestAgain: function(){
        this.isShowLoading = true
        _.getUserInfo(this.storeUserInfo,this.getUserInfoErr)
      },
      clickItem: function(i) {
        console.log(1)
        var isCatalog = this.data[i].type
        this.$store.commit(SET_CURRENT_ITEM, this.data[i])
        if (isCatalog === CATALOG_FILE) {
          this.$router.push({ path: '/index/haschildren' })
        } else {
          this.openPDFHandler(i)
        }
      },
      callback: function(data) {
        if (!data.result) {
          mui.alert('返回的数据为空!', '提示', '确定')
          return
        }
        data = data.result.catalog
        this.data = data
        if (!(data&&this.data.length)){
          this.isNoFile = true
        }
      },
      error: function(err) {
        this.isShowLoading = false
        this.isError = true
        mui.alert('访问数据失败!', '提示', '确定')
      },
      exitApp: function() {
        _.exitApp()
      },
      storeUserInfo: function(info) {
        if (typeof(info) === 'string') {
          info = JSON.parse(info)
        }
        info = info.result
        if(typeof(info) === 'string') {
          info = JSON.parse(info)
        }
        var user_code = info.usercode
        var ip = info.ip
        var port = info.port
        if (ip&&port) {
          _.setConfig(
            ip,
            port,
            'com.ifbpmob.jrpt.controller.FileController'
          )
          _.getData(
            {
              appid: 'library',
              action: 'handler',
              params: {
                transtype: 'cataloglist',
                catalog_id: ''
              }
            },
            this.callback,
            this.error
          )
        }
        this.userCode = user_code+'@yonyou.com'
        _.setStorage('user_code',user_code)
      },
      getUserInfoErr: function(e) {
        this.isShowLoading = false
        this.isError = true
        mui.alert('获取用户信息失败!','提示','确定')
      }
    },
    components: {
      ListItem: libraryComponents.ListItem,
      LibToast: libraryComponents.LibToast,
      LibLoading: libraryComponents.LibLoading,
      LibNofileImg: libraryComponents.LibNofileImg,
      NetErrImg: libraryComponents.NetErrImg
    }
  })
}
