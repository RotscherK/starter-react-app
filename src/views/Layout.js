import React from 'react';
import Navbar from '../components/Navbar';

import { Outlet } from "react-router-dom";

function Layout({isLoggedIn, setIsLoggedIn}) {
    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="content">
                {/* Render nested routes */}
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;