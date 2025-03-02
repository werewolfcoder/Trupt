import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LiveTracking from '../components/LiveTracking';

const TrackingPage = () => {
    const { donationId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-white p-4 shadow-md flex items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <h1 className="text-xl font-semibold ml-4">Live Tracking</h1>
            </div>
            <div className="flex-1">
                <LiveTracking donationId={donationId} />
            </div>
        </div>
    );
};

export default TrackingPage;
