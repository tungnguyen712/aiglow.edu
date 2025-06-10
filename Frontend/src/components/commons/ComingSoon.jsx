import PropTypes from "prop-types";

const ComingSoon = ({ content = "This feature is under development. Coming soon!" }) => {
    return (
        <div
            className="absolute inset-0 bg-white dark:bg-slate-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <p className="relative text-black dark:text-white">
                {content}
            </p>
        </div>
    )
}

ComingSoon.propTypes = {
    content: PropTypes.string
}

export default ComingSoon;