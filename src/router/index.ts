import { createRouter,createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import Data from '../views/Data.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'
import Account from '../views/Account.vue'
import About from '../views/About.vue'
import Detail from '../views/Detail.vue'
const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/login',
            component:Login
        },
        {
            path:'/home',
            component:Home
        },
        {
            path:'/data',
            component:Data
        },
        {
            path:'/user',
            component:User
        },
        {
            path:'/account',
            component:Account
        },
        {
            path:'/about',
            component:About
        },
        {
            path:'/detail',
            component:Detail
        },
        
    ]
})
export default router;