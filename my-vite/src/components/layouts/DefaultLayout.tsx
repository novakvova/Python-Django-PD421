import {Outlet} from "react-router";
import Navbar from "../Navbar/Navbar.tsx";
const DefaultLayout = () => {
    return (
        <>
            <Navbar/>
            <div className="container mx-auto">
                <Outlet/>
            </div>
        </>
    );
};

export default DefaultLayout;