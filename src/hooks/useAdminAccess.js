import { useState, useEffect } from "react";

export const useAdminAccess = (adminHash) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAccess = () => setIsAdmin(window.location.hash === adminHash);
        checkAccess();
        window.addEventListener("hashchange", checkAccess);
        return () => window.removeEventListener("hashchange", checkAccess);
    }, [adminHash]);

    return isAdmin;
};