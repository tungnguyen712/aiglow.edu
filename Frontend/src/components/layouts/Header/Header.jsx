import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "@/config";
import { useSidebar } from "@/context/SidebarContext";
import { Button } from "@/components/commons";
import ActionButtons from "@/components/layouts/Header/ActionButtons";
import { DashboardCircleAdd, DashboardCircleRemove } from "@/assets/icons";
import { Image } from "@/components/commons";
import { FSoft } from "@/assets/images";

function Header({ sidebarShow }) {
    const { isOpen, toggleSidebar } = useSidebar();

    return (
        <div className="flex items-center justify-between sticky top-0 z-50 p-3 lg:p-6 transition-all rounded-3xl backdrop-blur-sm">
            {sidebarShow ? (
                <Button
                    content={isOpen ? <DashboardCircleRemove /> : <DashboardCircleAdd />}
                    className="flex items-center justify-center w-12 h-12 bg-slate-50 text-gray-500 dark:bg-slate-800 dark:text-white transition-all duration-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-xl"
                    handleEvent={toggleSidebar}
                />
            ) : (
                <Link to={config.routes.HOME} className="text-black dark:text-white">
                    <Image src={FSoft} alt="FPT Software" className="w-36 object-contain" />
                    <b className="block text-center">Career Upskilling</b>
                </Link>
            )}

            <ActionButtons />
        </div>
    );
}

Header.propTypes = {
    sidebarShow: PropTypes.bool,
};

export default Header;
