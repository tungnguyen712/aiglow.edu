import config from "@/config";
import Home from "@/components/pages/Home";
import Chat from "@/components/pages/Chat";
import Profile from "../components/pages/Profile";
import Login from "@/components/pages/Auth/Login";
import ForgotPassword from "@/components/pages/Auth/ForgotPassword";
import NotFound from "@/components/pages/Others/NotFound";
import Register from "@/components/pages/Auth/Register";

const routes = [
    { path: config.routes.HOME, component: Home },
    { path: config.routes.CHAT, component: Chat },
    { path: config.routes.PROFILE, component: Profile },
    { path: config.routes.NOT_FOUND, component: NotFound },
];

const authenticationRoutes = [
    { path: config.routes.LOGIN, component: Login },
    { path: config.routes.REGISTER, component: Register },
    { path: config.routes.FORGOT_PASSWORD, component: ForgotPassword },
];

export { routes, authenticationRoutes };
