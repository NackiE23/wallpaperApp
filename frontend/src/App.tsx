import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageInfo from './pages/ImageInfo';
import './style.css';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="imageinfo" element={<ImageInfo />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
