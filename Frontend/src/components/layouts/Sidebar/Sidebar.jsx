import { Fragment,  useState } from "react";
import {Link} from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";

import Menu, { MenuItem } from "../Menu/index.js";
import ExpressMenu from "../Menu/ExpressMenu.jsx";
import DBFrom from "@/components/views/DBFrom";

import config from ".@/config";
import { Button } from "@/components/commons";
import { MoonIcon, NotificationIcon, CalendarIcon, SunIcon, CancelIcon } from "@/assets/icons";
import { menuItems } from "@/mock/data";
import { HomeIcon } from "@/assets/icons";

const Sidebar = () => {
    const { darkMode, setDarkMode } = useTheme();
    const { isOpen, toggleSidebar } = useSidebar();

    const [showModal, setShowModal] = useState(false);
    const [connected, setConnected] = useState(false);

    return (
        <Fragment>
            <div
                className={`sticky top-6 left-0 hidden lg:flex lg:flex-col h-[calc(100vh-48px)] overflow-hidden bg-white dark:bg-slate-800 text-dark rounded-r-[35px] my-6 p-4 pr-1 pb-20 transition-all duration-300 ${
                    isOpen ? "lg:w-72" : "lg:w-0 lg:p-0"
                }`}
            >
                <div className="mt-3 mb-6 px-2">
                    <h1 className="text-2xl text-black font-bold dark:text-white">{isOpen ? "DXTBidMasters 🌷 " : "🌷"}</h1>
                </div>
                <ExpressMenu connected={connected} handleEvent={()=> setShowModal(!showModal)}  />
                <p className="uppercase text-[12px] dark:text-gray-300 mb-3">History chat</p>
                <div className="overflow-y-scroll scrollbar pr-2">
                    <Menu>
                        {menuItems.map((item, index) => (
                            <MenuItem key={index} to={item.path} title={item.title} status={isOpen}/>
                        ))}
                    </Menu>
                </div>
            </div>

            {/* Menu Mobile */}
            <div
                className={`fixed lg:hidden inset-[0_15%_0_0] p-4 pr-0 rounded-r-3xl bg-white dark:bg-slate-900 z-[9999] transition-all duration-300 ${!isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Button
                    content={
                        <div className="flex items-center gap-x-1 pr-4">
                        <CancelIcon />
                            Close
                        </div>
                    }
                    className="block pb-4 text-gray-500 dark:text-white ml-auto"
                    handleEvent={toggleSidebar}
                />

                <ExpressMenu connected={connected} handleEvent={() => setShowModal(!showModal)} closeSidebar={true} />

                <p className="uppercase text-[12px] dark:text-gray-300 mb-3">History chat</p>
                <div className="h-[calc(100vh-300px)] overflow-y-scroll scrollbar pb-8 pr-2">
                    <Menu>
                        {menuItems.map((item, index) => (
                            <MenuItem key={index} to={item.path} title={item.title} status={!isOpen}/>
                        ))}
                    </Menu>
                </div>

                <div className="flex items-center justify-center gap-x-8 mt-5">
                    <Link to={config.routes.HOME} className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full">
                        <HomeIcon />
                    </Link>
                    <Button
                        content={darkMode ? <SunIcon/> : <MoonIcon/>}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-gray-700 dark:text-white transition-all duration-300 rounded-full"
                        handleEvent={() => setDarkMode(!darkMode)}
                    />
                    <Button
                        content={darkMode ? <SunIcon/> : <MoonIcon/>}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-gray-700 dark:text-white transition-all duration-300 rounded-full"
                        handleEvent={() => setDarkMode(!darkMode)}
                    />
                    <Button
                        content={<NotificationIcon/>}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-gray-700 dark:text-white transition-all duration-300 rounded-full"
                    />
                    <Button
                        content={<CalendarIcon/>}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-gray-700 dark:text-white transition-all duration-300 rounded-full"
                    />
                </div>
            </div>
            <div
                className={`fixed lg:hidden inset-0 bg-black z-[9990] transition-all duration-300 ${!isOpen ? "opacity-50 visible" : "opacity-0 invisible"}`}
                onClick={toggleSidebar}></div>

            <DBFrom showModal={showModal} setShowModal={setShowModal} setConnected={setConnected} />
        </Fragment>
    );
};

export default Sidebar;