import PropTypes from "prop-types";

const Progress = ({ value = 0, status="on-track" }) => {
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
            <div
                className={`h-full transition-all duration-300 ${status==="on-track"?"bg-green-500 dark:bg-green-400":status==="behind"?"bg-red-500 dark:bg-red-400":"bg-blue-500 dark:bg-blue-400"}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
};

Progress.propTypes = {
    value: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
};

export default Progress;
