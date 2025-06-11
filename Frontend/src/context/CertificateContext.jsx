import{ createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const CertificateContext = createContext();

export const CertificateContextProvider = ({ children }) => {

    const [formState, setFormState] = useState({
        name: "",
        issuer: "",
        issueDate: "",
        credentialID: "",
        credentialURL: "",
        category: "",
        certificateFile: null,
        status: "disconnected",
    });

    const resetForm = () => {
        setFormState({
            name: "",
            issuer: "",
            issueDate: "",
            credentialID: "",
            credentialURL: "",
            category: "",
            certificateFile: null,
            status: "disconnected",
        });
    };

    const [formErrors, setFormErrors] = useState({});

    return (
        <CertificateContext.Provider value={{ formState, setFormState, formErrors, setFormErrors, resetForm }}>
            {children}
        </CertificateContext.Provider>
    );
};

CertificateContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCertificateContext = () => useContext(CertificateContext);
