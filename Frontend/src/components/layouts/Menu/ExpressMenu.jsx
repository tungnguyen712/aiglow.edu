import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useSidebar } from "@/context/SidebarContext";
import { ConnectIcon, PencilEditIcon, MoreHorizontal } from "@/assets/icons";

function ExpressMenu({ connected, handleEvent, closeSidebar = false }) {
    const { toggleSidebar } = useSidebar();

    const handleClick = () => {
        handleEvent();
        if (closeSidebar) {
            toggleSidebar();
        }
    }

    return (
        <ul className="mr-3 mb-10">
            <li>
                <Link to=""
                      className="py-2 px-3 w-full font-normal text-sm dark:text-white hover:bg-gray-100 hover:dark:bg-[#2D3545] rounded-[0.4rem] flex items-center gap-x-2">
                    <PencilEditIcon size={23} className="text-gray-700 dark:text-white"/>
                    <span>New Roadmap</span>
                </Link>
            </li>
            <li>
                <button
                    className="py-2 px-3 w-full font-normal text-sm dark:text-white hover:bg-gray-100 hover:dark:bg-[#2D3545] rounded-[0.4rem] flex items-center justify-between gap-x-2"
                    onClick={handleClick}>
                    {connected ?
                        <>
                            <div className="flex items-center gap-x-2">
                                        <span className="relative flex size-2.5 mr-2">
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span
                                            className="relative inline-flex rounded-full size-2.5 bg-green-500"></span>
                                    </span>
                                <span>127.0.0.1:5500</span>
                            </div>
                            <MoreHorizontal />
                        </> :
                        <div className="flex items-center gap-x-2">
                            <ConnectIcon/>
                            <span>Connect Database</span>
                        </div>}
                </button>
            </li>
        </ul>
    )
}

ExpressMenu.propTypes = {
    connected: PropTypes.bool.isRequired,
    handleEvent: PropTypes.func,
    closeSidebar: PropTypes.bool
}

export default ExpressMenu;