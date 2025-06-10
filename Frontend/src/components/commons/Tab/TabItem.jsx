import PropTypes from "prop-types";
import { Fragment } from "react";

function TabItem({ children }) {
    return (
        <Fragment>{children}</Fragment>
    )
}

TabItem.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.node,
}

export default TabItem;