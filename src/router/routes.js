import Home from "../Views/Home.vue";
import NotFound from "../Views/404.vue";

const routes = [
    {
        path: "/",
        component: Home,
        meta: {
            title: "Home"
        }
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
        meta: {
            title: "404 Not Found"
        }
    },
];

export default routes
