import { Link } from "react-router-dom";
import config from "@/config";

function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-primary-500 dark:text-white">404</h1>
                <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Sorry, this page does not exist.</p>

                <Link to={config.routes.HOME} className="inline-flex text-gray-400 bg-primary-600 hover:bg-primary-800 font-medium rounded-lg px-5 py-3">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
