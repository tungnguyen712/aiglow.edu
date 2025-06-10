import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const MultiStepsFormContext = createContext();

export const MultiStepsFormContextProvider = ({ children }) => {

    const [formState, setFormState] = useState({
        goal: "",
        deadline: "",
        hoursPerWeek: "",
        selectedSkills: [],
        status: "disconnected",
    });

    const resetForm = () => {
        setFormState({
            goal: "",
            deadline: "",
            hoursPerWeek: "",
            selectedSkills: [],
            status: "disconnected",
        });
    };

    const [formErrors, setFormErrors] = useState({});

    return (
        <MultiStepsFormContext.Provider value={{ formState, setFormState, formErrors, setFormErrors, resetForm }}>
            {children}
        </MultiStepsFormContext.Provider>
    );
};

MultiStepsFormContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMultiStepsFormContext = () => useContext(MultiStepsFormContext);
