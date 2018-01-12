

summerready = function(){
   new Vue({
       el: '#app',
       mounted: function(){
        setTimeout(function(){
            mui.init({
                pullRefresh : {
                  container:"#refreshContainer",
                  down : {
                    height:'50px',
                     auto:false,//可选,默认false.自动下拉刷新一次
                    height:60,//可选.默认50.触发下拉刷新拖动距离
                    contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    auto: false,
                    callback :function(){
                        console.log(1)
                        setTimeout(function(){
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                            mui.toast('刷新成功')
                        },1000)
                    }
                  },
                  up : {
                    height:50,
                    auto:false,
                    contentrefresh : "正在加载...",
                    contentnomore:'没有更多数据了',
                    callback : function(){
                        setTimeout(function(){
                            // 没有更多数据的时候传true
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                        },1000)
                    } 
                  }
                }
              });
        },20)
       },
       methods: {
        pullfresh: function(){
            setTimeout(function(){
                mui('#refreshContainer').pullRefresh().endPulldown();
            },1000)
        }
       }
   })
}