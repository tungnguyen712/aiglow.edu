import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import Header from "@/components/layouts/Header";
// import Footer from "@/components/layouts/Footer";
// import Breadcrumb from "@/components/layouts/Breadcrumb";
import SidebarConnectDB from "@/components/layouts/Sidebar/SidebarConnectDB";

function Layout({ children, title, fullBackground = true, sidebarShow = false }) {
    return (
        <div className={sidebarShow ? "lg:grid lg:grid-cols-[auto,1fr]" : ""}>
            <Helmet>
                <title>{title} | DXTBidMasters</title>
            </Helmet>
            {sidebarShow && <SidebarConnectDB/>}
            <div className="flex-grow">
                <Header sidebarShow={sidebarShow}/>
                <div
                    className={`relative mx-3 mb-6 lg:mx-6 transition-all duration-300 ${fullBackground ? "bg-white dark:bg-slate-800 p-4 lg:p-8 rounded-3xl lg:rounded-[35px]" : ""}`}>
                    {/* <Breadcrumb title={title} /> */}
                    {children}
                </div>
                {/*<Footer />*/}
            </div>
        </div>
    );
}

Layout.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    fullBackground: PropTypes.bool,
    sidebarShow: PropTypes.bool,
};

export default Layout;