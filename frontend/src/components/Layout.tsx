import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './layout.css';


const Layout: React.FC = () => {
    return (
        <div className="layout">
            <nav className='sidebar'>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
            <main className='content'>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;