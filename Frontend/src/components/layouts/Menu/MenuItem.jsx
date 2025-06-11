import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/commons";
import { MoreHorizontal } from "@/assets/icons";
import { Flip, toast } from "react-toastify";

function MenuItem({ to, title, status, handleEvent = () => {} }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    const baseClasses = "flex items-center justify-between gap-x-2 py-2 px-3 relative rounded-[0.4rem] mb-1 font-normal text-gray-700 text-sm dark:text-white hover:bg-gray-100 hover:dark:bg-[#2D3545] transition-all group";
    const activeClasses = "dark:bg-[#2D3545] bg-gray-100";

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast('🦄 Upcoming feature!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Flip,
            closeButton: false,
        });
    };

    return (
        <li onClick={handleEvent}>
            <NavLink
                to={to}
                className={`${baseClasses} ${isActive ? activeClasses : ''}`}
            >
                {status && <span className="text-nowrap truncate">{title}</span>}

                <Button
                    content={<MoreHorizontal/>}
                    className={`${isActive ? 'block' : 'hidden'} group-hover:block`}
                    handleEvent={handleButtonClick}
                />
            </NavLink>
        </li>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
    status: PropTypes.bool,
    handleEvent: PropTypes.func,
};

export default MenuItem;
