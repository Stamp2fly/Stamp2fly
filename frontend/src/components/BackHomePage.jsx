import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';       // or any other icon you prefer

function BackToHomeButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/')}
            aria-label="Back to homepage"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center
                       w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700
                       text-white shadow-lg hover:shadow-xl transition-colors duration-200"
        >
            <Home className="w-6 h-6" />
        </button>
    );
}

export default BackToHomeButton;