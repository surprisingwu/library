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
      options: {
        click: true,
        pullDownRefresh: {
          threshold: 90,
          stop: 40,
          txt: 'Refresh success'
        },
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '',
            noMore: ''
          }
        }
      },
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
     },
    methods: {
      clickSearchBtn: function(){
        debugger
        this.$router.push({path: '/search'})
      },
      onPullingDown() {
        var that = this
        setTimeout(function(){
          mui.toast('刷新成功!')
         that.$refs.scroll.forceUpdate()
        }, 1000)
      },
      onPullingUp: function() {
        var that = this
        setTimeout(function(){  
          mui.toast('没有更多的数据了!')
          that.$refs.scroll.forceUpdate(false)    
        }, 1000)
      },
      openRequestAgain: function(){
        this.isError = false
        this.isShowLoading = true
        _.getUserInfo(this.storeUserInfo,this.getUserInfoErr)
      },
      clickItem: function(i) {
        var isCatalog = this.data[i].type
        this.$store.commit(SET_CURRENT_ITEM, this.data[i])
        if (isCatalog === CATALOG_FILE) {
          this.$router.push({ path: '/haschildren' })
        } else {
         this.$router.push({path: '/hasnochild'})
        }
      },
      callback: function(data) {
        if (!data.result) {
          mui.alert('返回的数据为空!', '提示', '确定')
          return
        }
        data = data.result.catalog
        // 为了让横屏也可以滚动,加一个空的文件夹
        // var temp = {file_type: 'catalog',file_name: '空文价夹',filetime: {time: Date.now()}}
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
      NetErrImg: libraryComponents.NetErrImg,
      LibSearchBtn: libraryComponents.LibSearchBtn
    }
  })
}
