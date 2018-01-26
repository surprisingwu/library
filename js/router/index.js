var libraryRouter = new VueRouter({
    routes: [
        {
            path: '/haschildren',
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
                                },
                                {
                                    path: 'hasnochild',
                                    component: libraryComponents.OpenIframe
                                }                                  
                            ]
                        },
                        {
                            path: 'hasnochild',
                            component: libraryComponents.OpenIframe
                        }      
                    ]
                },
                {
                    path: 'hasnochild',
                    component: libraryComponents.OpenIframe
                },
                {
                    path: 'search',
                    component: libraryComponents.LibSearchPage,
                    children: [
                        {
                            path: 'haschildren',
                            component: libraryComponents.FivePage,
                            children: [
                                {
                                    path: 'haschildren',
                                    component: libraryComponents.FivePage,
                                    children: [
                                        {
                                            path: 'haschildren',
                                            component: libraryComponents.FivePage,
                                            children: [
                                                {
                                                    path: 'haschildren',
                                                    component: libraryComponents.FivePage,
                                                    children: [
                                                        {
                                                            path: 'haschildren',
                                                            component: libraryComponents.FivePage,
                                                        },
                                                        {
                                                            path: 'hasnochild',
                                                            component: libraryComponents.OpenIframe
                                                        }                                  
                                                    ]
                                                },
                                                {
                                                    path: 'hasnochild',
                                                    component: libraryComponents.OpenIframe
                                                }                                  
                                            ]
                                        },
                                        {
                                            path: 'hasnochild',
                                            component: libraryComponents.OpenIframe
                                        }                                  
                                    ]
                                },
                                {
                                    path: 'hasnochild',
                                    component: libraryComponents.OpenIframe
                                }                                  
                            ]
                        },
                        {
                            path: 'hasnochild',
                            component: libraryComponents.OpenIframe
                        }                                  
                    ]
                }               
            ]
        },
        {
            path: '/hasnochild',
            component: libraryComponents.OpenIframe
        },
        {
            path: '/search',
            component: libraryComponents.LibSearchPage,
            children: [
                {
                    path: 'haschildren',
                    component: libraryComponents.FivePage,
                    children: [
                        {
                            path: 'haschildren',
                            component: libraryComponents.FivePage,
                            children: [
                                {
                                    path: 'haschildren',
                                    component: libraryComponents.FivePage,
                                    children: [
                                        {
                                            path: 'haschildren',
                                            component: libraryComponents.FivePage,
                                            children: [
                                                {
                                                    path: 'haschildren',
                                                    component: libraryComponents.FivePage,
                                                },
                                                {
                                                    path: 'hasnochild',
                                                    component: libraryComponents.OpenIframe
                                                }                                  
                                            ]
                                        },
                                        {
                                            path: 'hasnochild',
                                            component: libraryComponents.OpenIframe
                                        }                                  
                                    ]
                                },
                                {
                                    path: 'hasnochild',
                                    component: libraryComponents.OpenIframe
                                }                                  
                            ]
                        },
                        {
                            path: 'hasnochild',
                            component: libraryComponents.OpenIframe
                        }                                  
                    ]
                },
                {
                    path: 'hasnochild',
                    component: libraryComponents.OpenIframe
                }                                  
            ]
        }
    ]
}) 