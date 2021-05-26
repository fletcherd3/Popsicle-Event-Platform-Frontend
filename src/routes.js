import { createWebHistory, createRouter } from 'vue-router';
import Home from "./components/views/Home";
import SignIn from "./components/views/SignIn";
import Register from "./components/views/Register";
import Events from "./components/views/Events";
import EventDetails from "./components/views/EventDetails";
import CreateEvent from "./components/views/CreateEvent";

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
        path: "/events/create",
        name: "Create Event",
        meta: {title: 'Create Event'},
        component: CreateEvent
    },
    {
        path: "/events/:eventId(\\d+)",
        name: "Event Details",
        meta: {title: 'Event Details'},
        component: EventDetails,
        props: route => ({
            eventId: parseInt(route.params.eventId, 10)
        }),
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