import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

/* SITEMAP
/home
    /profile
        /reservations   USER ONLY   manage reservations
            /edit       USER ONLY   edit reservation

        /admin          ADMIN ONLY  manage admin tools
            /create     ADMIN ONLY  create room
            /edit       ADMIN ONLY  manage room

        /setting        account settings


    /rooms              browse Spots
        /reserve        USER ONLY create reservation
*/

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/rooms',
        name: 'Rooms',
        component: () => import(/* webpackChunkName: "rooms" */ '../views/Rooms.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
