import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "@/config";

function Breadcrumb({ title }) {
    return (
        <ol className="flex items-center whitespace-nowrap mb-5">
            <li className="inline-flex items-center">
                <Link
                    to={config.routes.HOME}
                    className="flex items-center text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                >
                    Home
                </Link>
                <svg
                    className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </li>

            <li className="inline-flex items-center font-semibold text-gray-800 truncate dark:text-neutral-200">{title}</li>
        </ol>
    );
}

Breadcrumb.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Breadcrumb;
