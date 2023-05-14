export default [
  {
    path: '/admin',
    layout: false,
    routes: [
      {
        name:'login',
        path:'/admin/login',
        component: './Admin/Login'
      }, {
        component: './Exception/404',
      },
    ],
  },{
    path: '/auth',
    name: 'auth',
    routes: [
      {
        path: '/auth',
        redirect: '/auth/users'
      }, {
        path: '/auth/users',
        name: 'user',
        component: './Auth/User/index',
      }, {
        path: '/auth/roles',
        name: 'role',
        component: './Auth/Role/index',
      }, {
        path: '/auth/permissions',
        name: 'permission',
        component: './Auth/Permission/index',
      }, {
        path: '/auth/menu',
        name: 'menu',
        component: './Auth/Menu/index',
      }
    ]
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: './Dashboard/index'
  },{
    path: '/',
    redirect: '/dashboard',
  },{
    path: '/error/403',
    component: './Exception/403',
  },{
    component: './Exception/404',
  }
];
