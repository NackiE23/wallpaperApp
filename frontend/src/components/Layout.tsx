import React, { useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './layout.css';


const Layout: React.FC = () => {
    const contentRef = useRef<HTMLDivElement | null>(null);

    const scrollToTop = () => {
        if (contentRef.current) {
            contentRef.current.scrollTo({top: 0, behavior: "smooth"})
        }
    }

    return (
        <div className="layout">
            <nav className='sidebar'>
                <Link to="/">Home</Link>
                <Link to="/imageinfo">Test Image Info</Link>
            </nav>
            <main className='content' ref={contentRef}>
                <Outlet context={{ scrollToTop }} />
            </main>
        </div>
    )
}

export default Layout;