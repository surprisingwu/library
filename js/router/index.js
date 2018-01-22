var libraryRouter = new VueRouter({
    routes: [
        {
            path: '/index/haschildren',
            component: libraryComponents.SecondPage,
            children: [
                {
                    path: 'haschildren',
                    component: libraryComponents.ThirdPage,
                    children: [
                        {
                            path: 'haschildren',
                            component: libraryComponents.FouthPage,
                            children: [
                                {
                                    path: 'haschildren',
                                    component: libraryComponents.FivePage,
                                }                            
                            ]
                        },
                    ]
                }               
            ]
        }
    ]
}) 