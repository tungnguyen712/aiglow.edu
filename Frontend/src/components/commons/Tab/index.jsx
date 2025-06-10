import PropTypes from "prop-types";
import { Fragment, useState } from "react";

function Tab({ children }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Fragment>
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {children.map((child, index) => (
                    <li key={index}>
                        <button
                            onClick={() => setActiveTab(index)}
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition duration-300 ${
                                index === activeTab
                                    ? "border-blue-500 text-blue-500"
                                    : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`}
                        >
                            {child.props.title}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="mt-5">
                {children[activeTab]}
            </div>
        </Fragment>
    )
}

Tab.propTypes = {
    children: PropTypes.node.isRequired
}

export default Tab;