import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("dark-mode");
        return savedMode === "true";
    });

    useEffect(() => {
        localStorage.setItem("dark-mode", darkMode);
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    return <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
