import{ createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const DBFromContext = createContext();

export const DBFromContextProvider = ({ children }) => {

    const [formData, setFormData] = useState({
        type: "",
        dbms: "",
        username: "",
        password: "",
        databaseName: "",
        host: "",
        port: "",
        status: "connected",
        chatHistoryDtos: [
            {
                sender: "AI",
                content: "How can can i help you",
                time: "2023-10-10T10:00:00"
            }
        ]
    });

    const [formErrors, setFormErrors] = useState({});

    return (
        <DBFromContext.Provider value={{ formData, setFormData, formErrors, setFormErrors }}>
            {children}
        </DBFromContext.Provider>
    );
};

DBFromContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFormDBContext = () => useContext(DBFromContext);
