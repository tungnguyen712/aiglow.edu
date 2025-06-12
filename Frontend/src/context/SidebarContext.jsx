import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [statusContext, setStatusContext] = useState("on-track");
    const [progressContext, setProgressContext] = useState(0);
    const [newCourseList, setNewCourseList] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, statusContext, setStatusContext, progressContext, setProgressContext, newCourseList, setNewCourseList }}>
            {children}
        </SidebarContext.Provider>
    );
};

SidebarProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => useContext(SidebarContext);
