import PropTypes from "prop-types";
import {Navigate, Route, Routes} from "react-router-dom";
import { routes, authenticationRoutes } from "@/routes/routes";
import { isLoggedIn } from "./utils/auth";

function App() {
    const ProtectedRoute = ({ element }) => {
        const isAuthenticated = isLoggedIn();
        return isAuthenticated ? element : <Navigate to="/login" replace />;
    };

    const ProtectedAuthRoute = ({ element }) => {
        const isAuthenticated = isLoggedIn();
        return isAuthenticated ? <Navigate to="/" replace /> : element;
    };

    ProtectedRoute.propTypes = {
        element: PropTypes.node.isRequired,
    };

    ProtectedAuthRoute.propTypes = {
        element: PropTypes.node.isRequired,
    };


    return (
        <Routes>
            {routes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<ProtectedRoute element={<Page />} />} />;
            })}

            {authenticationRoutes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<ProtectedAuthRoute element={<Page />} />} />;
            })}
        </Routes>
    );
}

export default App;
