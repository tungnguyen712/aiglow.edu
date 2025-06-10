import PropTypes from "prop-types";
import { Image } from "@/components/commons";
import {Fragment} from "react";

const Message = ({ message, sender, avatar, alt= "" }) => {
    return (
        <Fragment>
            {sender === "user" ?
                <div className="flex flex-row gap-x-3 mb-6 justify-end">
                    <div
                        className="relative bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-xl lg:max-w-2xl"
                    >
                <pre className="text-black dark:text-white whitespace-pre-wrap break-words">
                    {message}
                </pre>
                    </div>
                    <div
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 flex-shrink-0  border-2 border-gray dark:border-white border-opacity-20 dark:border-opacity-20 overflow-hidden"
                    >
                        <Image src={avatar} alt={alt}/>
                    </div>
                </div> : <div className="flex flex-row gap-x-3 mb-6">
                    <div
                        className="flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0 border-2 border-gray-200 dark:border-white overflow-hidden text-white">🌷
                    </div>
                    <div
                        className="bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-xl lg:max-w-2xl">
                    <pre
                        className="text-black dark:text-white whitespace-pre-wrap break-words">
                        {message}
                    </pre>
                    </div>
                </div>
            }
        </Fragment>

    )
}

Message.propTypes = {
    message: PropTypes.string.isRequired,
    sender: PropTypes.string,
    alt: PropTypes.string,
    avatar: PropTypes.node,
};

export default Message;