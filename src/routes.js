import { createWebHistory, createRouter } from 'vue-router';
import Home from "./components/views/Home";
import SignIn from "./components/views/SignIn";
import Register from "./components/views/Register";
import Events from "./components/views/Events";

const routes = [
    {
        path: "/",
        name: "Home",
        meta: {title: 'Popsicle | Event Platform'},
        component: Home,
        props: {
            msg: "Fletcher"
        }
    },
    {
        path: "/events",
        name: "Events",
        meta: {title: 'Find Events'},
        component: Events
    },
    {
        path: "/signin",
        name: "Sign In",
        meta: {title: 'Sign In'},
        component: SignIn
    },
    {
        path: "/register",
        name: "Register",
        meta: {title: 'Register'},
        component: Register
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory()
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})