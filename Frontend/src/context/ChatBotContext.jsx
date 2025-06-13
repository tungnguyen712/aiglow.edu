import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ChatBotContext = createContext();

export const ChatBotProvider = ({ children }) => {
    const [updateRequired, setUpdateRequired] = useState(false);

    return (
        <ChatBotContext.Provider value={{ updateRequired, setUpdateRequired }}>
            {children}
        </ChatBotContext.Provider>
    );
};

ChatBotProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChatBot = () => useContext(ChatBotContext);
