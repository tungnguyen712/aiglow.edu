import PropTypes from "prop-types";
import { forwardRef, Fragment } from "react";

const Input = forwardRef(
    (
        {
            type = "text",
            id,
            name,
            placeholder,
            className = "",
            value,
            onChange,
            error,
            icon,
            iconClick,
            showLabel = true,
            labelText = "",
            iconPosition = "right",
            disabled = false,
            readOnly = false,
            hidden = false,
        },
        ref
    ) => {
        return (
            <Fragment>
                {showLabel && labelText && (
                    <label htmlFor={id ? id : name}>
                        <p className="block antialiased leading-normal mb-2 font-medium text-gray-900 dark:text-white">
                            {labelText}
                        </p>
                    </label>
                )}
                <div className="relative">
                    {icon && iconPosition === "left" && (
                        <button
                            type="button"
                            onClick={iconClick}
                            className="absolute top-2/4 left-3 -translate-y-2/4 dark:text-white"
                        >
                            {icon}
                        </button>
                    )}

                    <input
                        ref={ref}
                        id={id ? id : name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        disabled={disabled}
                        readOnly={readOnly}
                        hidden={hidden}
                        onChange={onChange}
                        className={`w-full h-12 focus:border-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-500 outline outline-0 focus:outline-0 transition-all border p-3 rounded-md  ${className} ${
                            error ? "!border-red-500" : ""
                        } ${icon ? (iconPosition === "right" ? "pr-10" : "pl-10") : ""} ${
                            type === "number"
                                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                : ""
                        }`}
                    />

                    {icon && iconPosition === "right" && (
                        <button
                            type="button"
                            onClick={iconClick}
                            className="absolute top-2/4 right-3 -translate-y-2/4 dark:text-white"
                        >
                            {icon}
                        </button>
                    )}
                </div>

                <span className="text-[12px] block h-4 text-red-500">
                  {error ? error : ""}
                </span>
            </Fragment>
        );
    }
);

Input.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    icon: PropTypes.node,
    iconClick: PropTypes.func,
    showLabel: PropTypes.bool,
    labelText: PropTypes.string,
    iconPosition: PropTypes.oneOf(["left", "right"]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
};

Input.displayName = "Input";

export default Input;
