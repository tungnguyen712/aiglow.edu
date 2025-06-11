import { Fragment, useState } from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import config from "@/config";
import { useTheme } from "@/context/ThemeContext";
import { removeAccessToken } from "@/utils/auth";
import { Image, Button } from "@/components/commons";
// import { HomeIcon, PencilEditIcon, UserSharingIcon, CustomerSupportIcon, MoonIcon, SunIcon, LogoutIcon } from "@/assets/icons";
import { HomeIcon, UserSharingIcon, CustomerSupportIcon, MoonIcon, SunIcon, LogoutIcon } from "@/assets/icons";
import { getDecodedToken } from "@/utils/auth";

function DropDownMenu() {
    const location = useLocation();
    const navigate = useNavigate()
    const { darkMode, setDarkMode } = useTheme();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const isHome = location.pathname === config.routes.HOME;

    const menuDropdown = [
        !isHome && {
            title: "Home",
            path: config.routes.HOME,
            icon: <HomeIcon />,
            separate: false,
        },
        // {
        //     title: "New Roadmap",
        //     path: "",
        //     icon: <PencilEditIcon size={22} />,
        //     separate: true,
        // },
        {
            title: "Personal Information",
            path: config.routes.PROFILE,
            icon: <UserSharingIcon />,
            separate: false,
        },
        {
            title: "Support",
            path: "",
            icon: <CustomerSupportIcon />,
            separate: true,
            disabled: true,
        },
        {
            title: darkMode ? "Light mode" :"Dark mode",
            path: "",
            icon: darkMode ? <SunIcon /> : <MoonIcon />,
            handleEvent: () => setDarkMode(!darkMode),
            separate: true,
        },
        {
            title: "Logout",
            path: "",
            icon: <LogoutIcon />,
            handleEvent: () => {
                removeAccessToken()
                navigate(config.routes.LOGIN)
            },
            separate: false,
        },
    ].filter(Boolean);

    const decodeToken = getDecodedToken();

    return (
        <div className="relative inline-block text-left">
            <Button
                content={
                    <Fragment>
                        <div className="flex items-center gap-x-2">
                            <Image src="" className="w-9 h-9 rounded-full object-cover border-2 border-gray dark:border-white border-opacity-20 dark:border-opacity-20" />
                            <div className="text-start">
                                <span className="block text-sm text-nowrap">{decodeToken ? decodeToken.sub : "DXTBidMasters"}</span>
                                <small className="text-slate-400 dark:text-white">{decodeToken ? decodeToken.scope : "FHN.DXT"}</small>
                            </div>
                        </div>
                        <svg className={`-mr-1 h-5 w-5 text-gray-400 dark:text-white transition-all ${showDropdown ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Fragment>
                }
                handleEvent={handleDropdown}
                className="inline-flex w-full items-center justify-center gap-x-1.5 px-2 py-1 bg-slate-50 text-sm text-gray-500 dark:bg-slate-800 dark:text-white rounded-full hover:bg-gray-50"
            />

            <ul
                className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-md overflow-hidden dark:shadow-slate-950 focus:outline-none transition-all duration-300 ${
                    showDropdown ? "visible opacity-100" : "invisible opacity-0"
                }`}
                tabIndex="-1"
            >
                {menuDropdown.map((item, index) => (
                   <li key={index}>
                       {item.disabled ? (
                           // Disabled item with tooltip
                            <div className={`flex items-center gap-x-2 px-4 py-3 w-full text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50 ${item.separate ? "border-b border-gray-200 dark:border-gray-500" : ""}`}>
                                {item.icon} {item.title}
                            </div>
                       ) : item.handleEvent ? (
                           // Interactive button items
                           <Button content={item.title} icon={item.icon} iconPosition="left" handleEvent={item.handleEvent} className={`flex items-center px-4 py-3 w-full text-sm text-gray-500 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white ${item.separate ? "border-b border-gray-200 dark:border-gray-500" : ""}`}/>
                       ) : (
                           // Navigation links
                           <NavLink
                               to={item.path}
                               className={`flex items-center gap-x-2 px-4 py-3 w-full text-sm text-gray-500 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white ${item.separate ? "border-b border-gray-200 dark:border-gray-500" : ""}`}
                               tabIndex="-1"
                           >
                               {item.icon} {item.title}
                           </NavLink>
                       )}
                   </li>
                ))}
            </ul>
        </div>
    );
}

export default DropDownMenu;
