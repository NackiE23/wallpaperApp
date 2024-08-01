import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './layout.css';


const Layout: React.FC = () => {
    return (
        <div className="layout">
            <nav className='sidebar'>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <main className='content'>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;