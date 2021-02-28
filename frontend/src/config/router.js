import Vue from 'vue'
import VueRouter from 'vue-router'

import Pessoa from '@/components/pages/Pessoa'
import Registro from '@/components/pages/Registro'
import Home from '@/components/pages/Home'
// import AdminPages from '@/components/admin/AdminPages'
// import ArticlesByCategory from '@/components/article/ArticlesByCategory'
// import ArticleById from '@/components/article/ArticleById'
// import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'pessoa',
    path: '/pessoa',
    component: Pessoa
}, {
    name: 'registro',
    path: '/registro',
    component: Registro
}, {
    name: 'home',
    path: '/',
    component: Home
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router
