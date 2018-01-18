var libraryRouter = new VueRouter({
    routes: [
        {
            path: '/index/haschildren',
            component: libraryComponents.SecondPage,
            children: [
                {
                    path: 'haschildren',
                    component: libraryComponents.ThirdPage
                },
                {
                    path: 'nochild',
                    component: libraryComponents.OpenIframe
                }
            ]
        },
        {
            path: '/index/nochild',
            component: libraryComponents.OpenIframe
        }
    ]
}) 