import React from 'react';
import RepresentativeNavbar from './RepresentativeNavbar';
import InstructorStatisticsPage from '../instructor/InstructorStatistics'; // adjust path if needed

export default function RepresentativeStatisticsPage() {
    return (
        <div>
            <RepresentativeNavbar />
            <InstructorStatisticsPage />
        </div>
    );
}
