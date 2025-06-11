import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/commons/Button";
import DropDownMenu from "@/components/layouts/Header/DropDownMenu";
import { MoonIcon, NotificationIcon, CalendarIcon, SunIcon } from "@/assets/icons";
import Tooltip from "@/components/commons/Tooltip";

function ActionButtons() {
    const { darkMode, setDarkMode } = useTheme();

    return (
        <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4 ">
                <Tooltip text={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                    <Button
                        content={darkMode ? <SunIcon /> : <MoonIcon />}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full"
                        handleEvent={() => setDarkMode(!darkMode)}
                    />
                </Tooltip>
                <Tooltip text="Feature is in development">
                    <Button
                        disabled={true}
                        content={<NotificationIcon />}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full opacity-50 cursor-not-allowed"
                    />
                </Tooltip>
                <Tooltip text="Feature is in development">
                    <Button
                        disabled={true}
                        content={<CalendarIcon />}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-full opacity-50 cursor-not-allowed"
                    />
                </Tooltip>
            </div>

            <DropDownMenu />
        </div>
    );
}

export default ActionButtons;
