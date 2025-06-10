import PropTypes from "prop-types";
import { Fragment, useMemo } from "react";
import SelectComponent from "react-select";
import CreatableSelect from "react-select/creatable";
import { useTheme } from "@/context/ThemeContext";

function Select({ value, labelText = "", options = [], disabled = false, error, showLabel = true, onChange, isClearable = false, borderStyle = "solid" }) {
    const { darkMode } = useTheme();
    const whiteColor = "#ffffff";
    const blackColor = "#000000";
    const transparentColor = "transparent";

    const customStyles = useMemo(
        () => ({
            control: (provided, state) => ({
                ...provided,
                height: "45px",
                borderRadius: "0.375rem",
                backgroundColor: darkMode ? "#374151" : transparentColor,
                boxShadow: "none",
                borderStyle: borderStyle,
                "&:hover": {
                    borderColor: "none",
                },
                borderColor: state.isFocused ? "#e5e7eb" : error ? "#ef4444" : darkMode ? "#6b7280" : "#e5e7eb",
                fontWeight: 300,
            }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? "#374151" : whiteColor,
            }),
            option: (provided) => ({
                ...provided,
                backgroundColor: darkMode ? "#374151" : whiteColor,
                color: darkMode ? whiteColor : blackColor,
                fontWeight: 300,
                "&:hover": {
                    backgroundColor: darkMode ? whiteColor : "#374151",
                    color: darkMode ? blackColor : whiteColor,
                },
            }),
            singleValue: (provided) => ({
                ...provided,
                color: darkMode ? whiteColor : blackColor,
            }),
        }),
        [darkMode, whiteColor, blackColor, transparentColor, borderStyle, error]
    );

    const SelectComponentToRender = isClearable ? CreatableSelect : SelectComponent;

    return (
        <Fragment>
            {showLabel && labelText && (
                <span className="block antialiased leading-normal mb-2 font-medium text-gray-900 dark:text-white">{labelText}</span>
            )}

            <SelectComponentToRender
                value={value}
                isClearable={isClearable}
                options={options}
                onChange={onChange}
                styles={customStyles}
                isDisabled={disabled}
                className={error ? "border-red-600" : ""}
            />
            <span className="text-[12px] block h-4 text-red-500">{error ? error : ""}</span>
        </Fragment>
    );
}

Select.propTypes = {
    value: PropTypes.object,
    labelText: PropTypes.string,
    options: PropTypes.array,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    onChange: PropTypes.func,
    isClearable: PropTypes.bool,
    borderStyle: PropTypes.string
};

export default Select;
