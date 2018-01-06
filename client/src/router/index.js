import Vue from 'vue'
import Router from 'vue-router'
import feathersClient from '@/api/feathers-client'
import Home from '@/pages/Home'
import Registration from '@/pages/Registration'
import Login from '@/pages/Login'
import Main from '@/pages/main/Main'
import Dashboard from '@/pages/main/Dashboard'
import Modeler from '@/pages/main/Modeler'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'modeler',
          name: 'Modeler',
          component: Modeler
        }
      ]
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    feathersClient.passport.getJWT().then(response => {
      if (!response) {
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
