import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx"; // Optional helper for cleaner class merging

function Tooltip({ children, text, position = "bottom", className = "relative inline-block" }) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
        options: "bottom-2/3 left-1/4 transform -translate-x-1/2 mb-2",
    };

    return (
        <div
            className={clsx(className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={clsx(
                        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap",
                        positionClasses[position]
                    )}
                >
                    {text}
                    <div
                        className={clsx(
                            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
                            position === "top"
                                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                                : position === "bottom"
                                ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                                : position === "left"
                                ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                                : position === "options"
                                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                                : "right-full top-1/2 -translate-y-1/2 -mr-1"
                        )}
                    ></div>
                </div>
            )}
        </div>
    );
}

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(["top", "bottom", "left", "right", "options"]),
    className: PropTypes.string,
};

export default Tooltip;
