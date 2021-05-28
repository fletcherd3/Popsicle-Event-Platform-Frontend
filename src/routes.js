import { createWebHistory, createRouter } from 'vue-router';
import Home from "./components/views/Home";
import SignIn from "./components/views/SignIn";
import Register from "./components/views/Register";
import Events from "./components/views/Events";
import EventDetails from "./components/views/EventDetails";
import CreateEvent from "./components/views/CreateEvent";
import EditEvent from "./components/views/EditEvent";
import UserProfile from "./components/views/UserProfile";
import EditUserProfile from "./components/views/EditUserProfile";

const routes = [
    {
        path: "/",
        name: "Home",
        meta: {title: 'Popsicle | Event Platform'},
        component: Home
    },
    {
        path: "/profile",
        name: "Profile",
        meta: {title: 'Popsicle | Profile'},
        component: UserProfile,
    },
    {
        path: "/profile/:userId(\\d+)/edit",
        name: "Edit Profile",
        meta: {title: 'Popsicle | Edit Profile'},
        component: EditUserProfile,
        props: route => ({
            userId: parseInt(route.params.userId, 10)
        })
    },
    {
        path: "/events",
        name: "Events",
        meta: {title: 'Popsicle | Find Events'},
        component: Events
    },
    {
        path: "/events/create",
        name: "Create Event",
        meta: {title: 'Popsicle | Create Event'},
        component: CreateEvent
    },
    {
        path: "/events/:eventId(\\d+)/edit",
        name: "Edit Event",
        meta: {title: 'Popsicle | Edit Event'},
        component: EditEvent,
        props: route => ({
            eventId: parseInt(route.params.eventId, 10)
        })
    },
    {
        path: "/events/:eventId(\\d+)",
        name: "Event Details",
        meta: {title: 'Popsicle | Event Details'},
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
        meta: {title: 'Popsicle | Register'},
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