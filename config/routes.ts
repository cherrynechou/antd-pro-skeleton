export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      {
        name:'login',
        path:'/auth/login',
        component: './Auth/Login'
      }, {
        component: './Exception/404',
      },
    ],
  },{
    path: '/admin',
    name: 'admin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/users'
      }, {
        path: '/admin/users',
        name: 'user',
        component: './Admin/User/index',
      }, {
        path: '/admin/roles',
        name: 'role',
        component: './Admin/Role/index',
      }, {
        path: '/admin/permissions',
        name: 'permission',
        component: './Admin/Permission/index',
      }, {
        path: '/admin/menu',
        name: 'menu',
        component: './Admin/Menu/index',
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
