// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store';
import { ElLoading } from 'element-plus';
let lodaingAni = null;

const routes = [
  {
    path: '/admins',
    name: 'home',
    component: () => import('@/App.vue')
  },
  {
    path: '/login1',
    name: 'LoginCom',
    component: () => import('@/views/LoginCom.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/admin',
    name: 'AdminIndex',
    component: () => import('@/views/AdminIndex.vue'),
    redirect: '/admin/index',
    children: [
      {
        // 如果默认访问路径为:/admin,那么将重定向到后台首页(/admin/index)
        path: '/',
        redirect: {
          name: 'HomeIndex'
        }
      },
      {
        path: 'index',
        meta: { title: '后台首页' },
        name: 'HomeIndex',
        component: () => import('@/views/HomeIndex.vue')
      },
      {
        path: 'goods/list',
        meta: { title: '商品管理' },
        name: 'GoodsList',
        component: () => import('@/views/GoodsList.vue')
      },
      {
        path: 'category/list',
        meta: { title: '分类管理' },
        name: 'CategoryList',
        component: () => import('@/views/CategoryList.vue')
      },
      {
        path: 'skus/list',
        meta: { title: '规格管理' },
        name: 'SkusList',
        component: () => import('@/views/SkusList.vue')
      },
      {
        path: 'user/list',
        meta: { title: '用户管理' },
        name: 'UserList',
        component: () => import('@/views/UserList.vue'),
      },
      {
        path : 'image/list',
        meta : { title : '图库管理' },
        name : 'PicList',
        component : ()=> import('@/views/PicList.vue')
      },
      {
        path : 'manager/list',
        meta : { title : '管理员管理' },
        name : 'ManagerCom',
        component : ()=> import('@/views/ManagerCom.vue')
      },
      {
        path : 'access/list',
        meta : { title : '权限管理' },
        name : 'RulesCom',
        component : ()=> import('@/views/RulesCom.vue')
      },
      {
        path : 'role/list',
        meta : { title : '角色管理' },
        name : 'RoleCom',
        component : ()=> import('@/views/RoleCom.vue')
      },
      {
        path : 'comment/list',
        meta : { title : '订单评论管理' },
        name : 'Comment',
        component : ()=> import('@/views/Comment.vue')
      },
      {
        path : 'order/list',
        meta : { title : '订单管理' },
        name : 'Order',
        component : ()=> import('@/views/Order.vue')
      }
    ]
  },
  {
    path: '/echartsdemo',
    name: 'EchartsDemo',
    component: () => import('@/components/EchartsDemo.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 设置全局路由守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  lodaingAni = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba( 0.5 , 0.5 , 0.5 , 0.5 )'
  })
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');

  // 判断：没有token且不是前往登录页的 ==> 非法闯入，强制扭送至登录页
  if (!tokenStr && to.path != '/login') {
    alert('非法闯入')
    return next('/login')
  }
  // 判断：有token且前往登录页 ==> 禁止返回登录，强制前往首页或者停留在当前页
  if (tokenStr && to.path == '/login') {
    return next({ path: from.path ? from.path : '/' })
  }
  // 判断：没有token但前往登录页 ==> 正常访问，直接放行
  // 判断：有token且前往其他页面 ==> 正常访问，直接放行

  // 如果用户登录成功，有token，调用异步函数action来自动获取管理员信息
  // if( tokenStr ){
  //   await store.dispatch('ActionGetUserInfo')
  // }

  next();
})
// 设置全局后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  lodaingAni.close()
})

export default router