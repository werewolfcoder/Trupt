import React, { createContext, useState } from 'react';

export const OrgDataContext = createContext();

const OrgContext = ({ children }) => {
    const [org, setOrg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrg = (newOrg) => {
        setOrg(newOrg);
    };

    const value={
        org,
        setOrg,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateOrg
    }
    return (
        <OrgDataContext.Provider value={value}>
            {children}
        </OrgDataContext.Provider>
    );
}

export default OrgContext;