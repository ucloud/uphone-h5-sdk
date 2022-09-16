import Vue from 'vue'
import VueRouter from 'vue-router'
import cookie from "../utils/cookie"

Vue.use(VueRouter)

const routes = [
  {
    path: '/groupview',
    name: 'GroupView',
    component: () => import('../views/GroupView')
  },
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  next()
})
export default router
