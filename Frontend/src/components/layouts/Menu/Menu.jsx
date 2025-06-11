import PropTypes from "prop-types";

function Menu({ children }) {
    return (
        <nav className="flex-grow">
            <ul>{children}</ul>
        </nav>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;
