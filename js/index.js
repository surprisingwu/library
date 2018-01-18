summerready = function() {
  new Vue({
    el: '#app',
    router: libraryRouter,
    store: libVuexStore,
    mixins: [libMixins.libClickHandler],
    created: function() {
      // _.getUserInfo(function(data){
      //   alert(JSON.stringify(data))
      // },function(err){
      //   console.log(err)
      // })
      _.setConfig(
        '10.4.102.36',
        '8130',
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
    },
    data: {
      data: [],
      isSuccess: true
    },
    mounted: function() {
      setTimeout(function() {
        mui.init({
          pullRefresh: {
            container: '#refreshContainer',
            down: {
              height: '50px',
              auto: false,
              height: 60,
              contentdown: '下拉可以刷新',
              contentover: '释放立即刷新',
              contentrefresh: '正在刷新...',
              auto: false,
              callback: function() {
                console.log(1)
                setTimeout(function() {
                  mui('#refreshContainer')
                    .pullRefresh()
                    .endPulldownToRefresh()
                  mui.toast('刷新成功')
                }, 1000)
              }
            },
            up: {
              height: 50,
              auto: false,
              contentrefresh: '正在加载...',
              contentnomore: '没有更多数据了',
              callback: function() {
                setTimeout(function() {
                  // 没有更多数据的时候传true
                  mui('#refreshContainer')
                    .pullRefresh()
                    .endPullupToRefresh(false)
                }, 1000)
              }
            }
          }
        })
      }, 20)
    },
    methods: {
      clickItem: function(i) {
        var isCatalog = this.data[i].type
        this.$store.commit(SET_CURRENT_ITEM, this.data[i])
        if (isCatalog === CATALOG_FILE) {
          this.$router.push({ path: '/index/haschildren' })
        } else {
          this.$router.push({ path: '/index/nochild' })
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
      exitApp: function() {
        _.exitApp()
      }
    },
    components: {
      ListItem: libraryComponents.ListItem,
      LibToast: libraryComponents.LibToast
    }
  })
}
