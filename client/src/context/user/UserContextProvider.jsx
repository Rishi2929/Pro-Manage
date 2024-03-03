import { useEffect, useState } from "react";
import UserContext from "./UserContext";
import useUserLocalStorage from "../../hooks/useUserLocalStorage";

const UserContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({});

    return (
        <UserContext.Provider value={{
            isAuthenticated, setIsAuthenticated,
            loggedInUser, setLoggedInUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
