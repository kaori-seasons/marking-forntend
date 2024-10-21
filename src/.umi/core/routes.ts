// @ts-nocheck
import React from 'react';
import {ApplyPluginsType, dynamic} from '/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import {plugin} from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
    const routes = [
        {
            "path": "/",
            "component": dynamic({
                loader: () => import(/* webpackChunkName: 'layouts__BlankLayout' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/layouts/BlankLayout'),
                loading: LoadingComponent
            }),
            "routes": [
                {
                    "path": "/user",
                    "component": dynamic({
                        loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/layouts/UserLayout'),
                        loading: LoadingComponent
                    }),
                    "routes": [
                        {
                            "path": "/user/login",
                            "name": "login",
                            "component": dynamic({
                                loader: () => import(/* webpackChunkName: 'p__user__login' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/login'),
                                loading: LoadingComponent
                            }),
                            "exact": true
                        },
                        {
                            "path": "/user",
                            "redirect": "/user/login",
                            "exact": true
                        },
                        {
                            "name": "register-result",
                            "icon": "smile",
                            "path": "/user/register-result",
                            "component": dynamic({
                                loader: () => import(/* webpackChunkName: 'p__user__register-result' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register-result'),
                                loading: LoadingComponent
                            }),
                            "exact": true
                        },
                        {
                            "name": "register",
                            "icon": "smile",
                            "path": "/user/register",
                            "component": dynamic({
                                loader: () => import(/* webpackChunkName: 'p__user__register' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register'),
                                loading: LoadingComponent
                            }),
                            "exact": true
                        },
                        {
                            "component": dynamic({
                                loader: () => import(/* webpackChunkName: 'p__404' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/404'),
                                loading: LoadingComponent
                            }),
                            "exact": true
                        }
                    ]
                },
                {
                    "path": "/",
                    "component": dynamic({
                        loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/layouts/BasicLayout'),
                        loading: LoadingComponent
                    }),
                    "Routes": [
                        "src/pages/Authorized"
                    ],
                    "authority": [
                        "admin",
                        "user"
                    ],
                    "routes": [
                        {
                            "path": "/",
                            "redirect": "/rulemarketing/ruledashboard",
                            "exact": true
                        },
                        {
                            "name": "rulemarketing",
                            "path": "/rulemarketing",
                            "icon": "smile",
                            "routes": [
                                {
                                    "path": "/",
                                    "redirect": "/rulemarketing/ruledefine",
                                    "exact": true
                                },
                                {
                                    "name": "ruledefine",
                                    "icon": "smile",
                                    "path": "/rulemarketing/ruledefine",
                                    "component": dynamic({
                                        loader: () => import(/* webpackChunkName: 'p__rulemarketing__ruledefine' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/ruledefine'),
                                        loading: LoadingComponent
                                    }),
                                    "exact": true
                                },
                                {
                                    "name": "ruledashboard",
                                    "icon": "smile",
                                    "path": "/rulemarketing/ruledashboard",
                                    "component": dynamic({
                                        loader: () => import(/* webpackChunkName: 'p__rulemarketing__ruledashboard' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/ruledashboard'),
                                        loading: LoadingComponent
                                    }),
                                    "exact": true
                                },
                                {
                                    "name": "rulemonitoring",
                                    "icon": "smile",
                                    "path": "/rulemarketing/rulemonitoring",
                                    "component": dynamic({
                                        loader: () => import(/* webpackChunkName: 'p__rulemarketing__rulemonitoring' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/rulemonitoring'),
                                        loading: LoadingComponent
                                    }),
                                    "exact": true
                                }
                            ]
                        },
                        {
                            "component": dynamic({
                                loader: () => import(/* webpackChunkName: 'p__404' */'/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/404'),
                                loading: LoadingComponent
                            }),
                            "exact": true
                        }
                    ]
                }
            ]
        }
    ];

    // allow user to extend routes
    plugin.applyPlugins({
        key: 'patchRoutes',
        type: ApplyPluginsType.event,
        args: {routes},
    });

    return routes;
}
