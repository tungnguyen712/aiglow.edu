import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { randomColor } from "@/utils/colors";
import { AbstractLine } from "@/assets/icons";

const ConversationCard = React.memo(({ item, handleEvent = () => {} }) => {
    return (
        <Link
            onClick={handleEvent}
            to={item.status === null || item.status === "disconnected" ? "#" : `/chat/${item.roomId}`}
            className="h-full p-4 bg-white dark:bg-slate-700 rounded-2xl relative overflow-hidden border border-dashed hover:border-gray-500 dark:border-gray-500 dark:hover:border-white transition duration-300"
        >
            <span
                className="size-24 rounded-full absolute -top-8 -right-8 ring-[20px]"
            ></span>
            <div className="flex flex-col h-full justify-between">
                <div className="mb-3">
                    <p className="tracking-wide font-light text-gray-500 dark:text-white">{item.databaseName}</p>
                    <h3 className="text-2xl font-semibold dark:text-white pb-3">{item.dbms} Database</h3>
                </div>
                <div className="flex justify-between text-sm font-light text-gray-500 dark:text-gray-300">
                    <p>Host: {item.host}</p>
                    <p>Port: {item.port}</p>
                </div>
                <div className="flex justify-between text-sm font-light text-gray-500 dark:text-gray-300 mt-2">
                    <p>Username: {item.username}</p>
                    <p>Status:
                        <span
                            className={`${
                                item.status === "conected" ? "text-green-500" : "text-red-500"
                            }`}
                        >
                            {item.status === "conected" ? " Connected" : " Disconnected"}
                        </span>
                    </p>
                </div>
            </div>
            <span className="rounded-full absolute -bottom-16 left-1/2 -translate-x-1/2 z-[1]">
                <AbstractLine color={randomColor()}/>
            </span>
        </Link>
    );
});

ConversationCard.propTypes = {
    item: PropTypes.shape({
        roomId: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        dbms: PropTypes.string.isRequired,
        host: PropTypes.string.isRequired,
        port: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        databaseName: PropTypes.string.isRequired,
        status: PropTypes.string
    }).isRequired,
    handleEvent: PropTypes.func
};

ConversationCard.displayName = "ConversationCard";

export default ConversationCard;
