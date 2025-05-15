import React from 'react';
import InstructorNav from './InstructorNav'; // import the styled navbar
import { Outlet } from 'react-router-dom';

const InstructorLayout = () => {
    return (
        <>
            <InstructorNav />
            <div style={{ padding: '2rem' }}>
                <Outlet />
            </div>
        </>
    );
};

export default InstructorLayout;
