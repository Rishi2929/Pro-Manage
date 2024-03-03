import { useState } from "react";
import UserContext from "./UserContext";

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
