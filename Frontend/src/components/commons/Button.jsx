import PropTypes from "prop-types";

function Button({ type = "button", content, className, disabled = false, icon, iconPosition = "right", isSubmitting = false, handleEvent = () => {} }) {
    return (
        <button type={type} className={`disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none ${className}`} onClick={handleEvent} disabled={disabled}>
            {isSubmitting ? (
                <span className="flex items-center justify-center gap-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"currentColor"} fill="currentColor" className="animate-spin">
                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
                        <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
                    </svg>
                    Processing...
                </span>
            ) : (
                <span className="flex items-center justify-center gap-x-2">
                    {iconPosition === "left" && icon}
                    {content}
                    {iconPosition === "right" && icon}
                </span>
            )}
        </button>
    );
}

Button.propTypes = {
    type: PropTypes.string,
    content: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(["left", "right"]),
    isSubmitting: PropTypes.bool,
    handleEvent: PropTypes.func,
};

export default Button;
