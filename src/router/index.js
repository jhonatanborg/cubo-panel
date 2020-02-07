import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'login',
  component: Login
},
{
  path: '/home',
  name: 'home',
  component: () => import('../views/Home.vue')
},
{
  path: '/clients',
  name: 'clients',
  component: () => import('../views/Client.vue')
},
{
  path: '/contract',
  name: 'contract',
  component: () => import('../views/Contract.vue')
},
{
  path: '/users',
  name: 'users',
  component: () => import('../views/Users.vue')
},
{
  path: '/boxes',
  name: 'boxes',
  component: () => import('../views/Boxes.vue')
},
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router