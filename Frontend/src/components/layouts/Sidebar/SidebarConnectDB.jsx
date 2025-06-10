import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import config from "@/config";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import DBForm from "@/components/views/DBForm";
import { Button } from "@/components/commons";
import { MoonIcon, NotificationIcon, CalendarIcon, SunIcon, HomeIcon, RoadMapIcon } from "@/assets/icons";
import ConnectedInfo from "@/components/views/ConnectedInfo";
import { useMultiStepsFormContext } from "@/context/MultiStepsFormContext";

const SidebarConnectDB = () => {
    const { darkMode, setDarkMode } = useTheme();
    const { isOpen, toggleSidebar } = useSidebar();
    const { formState } = useMultiStepsFormContext();

    useEffect(() => {
        console.log("Mounted formState:", formState);
        console.log("Mounted formState:", formState?.data?.status);
    }, [formState]);

    return (
        <Fragment>
            <div
                className={`sticky top-6 left-0 hidden lg:flex lg:flex-col h-[calc(100vh-48px)] overflow-hidden bg-white dark:bg-slate-800 text-dark rounded-r-[35px] my-6 p-4 pr-1 pb-10 transition-all duration-300 ${
                    isOpen ? "lg:w-[295px]" : "lg:w-0 lg:p-0"
                }`}
            >
                <h2 className="flex items-center gap-x-2 text-xl border-b border-dashed dark:border-gray-500 pb-4 text-black dark:text-white mb-5"><RoadMapIcon size="20"/>
                    {formState?.data?.status === "connected" ? "Current Goal Information" : "Current Goal Information"}
                </h2>
                {formState?.data?.status === "connected" ? (
                    <ConnectedInfo />
                ) : (
                    // <DBForm />
                    <ConnectedInfo />
                )}
            </div>

            {/* Menu Mobile */}
            <div
                className={`fixed lg:hidden inset-[0_15%_0_0] p-4 pr-0 rounded-r-3xl bg-white dark:bg-slate-900 z-[9999] transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-scroll scrollbar`}>
                <h2 className="flex items-center gap-x-2 text-xl border-b border-dashed dark:border-gray-500 pb-4 text-black dark:text-white mb-5">
                    <RoadMapIcon size="20"/>
                    {formState?.data?.status === "connected" ? "Current Goal Information" : "Current Goal Information"}
                </h2>
                {formState?.data?.status === "connected" ? (
                    <ConnectedInfo/>
                ) : (
                    <DBForm formType="mb"/>
                )}

                <div className="flex items-center justify-center gap-x-6 mt-5">
                    <Link to={config.routes.HOME}
                          className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full">
                        <HomeIcon/>
                    </Link>
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
                className={`fixed lg:hidden inset-0 bg-black z-[9990] transition-all duration-300 ${isOpen ? "opacity-50 visible" : "opacity-0 invisible"}`}
                onClick={toggleSidebar}></div>
        </Fragment>
    );
};

export default SidebarConnectDB;