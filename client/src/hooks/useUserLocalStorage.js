import React, { useEffect, useState } from 'react';

const useUserLocalStorage = () => {
  const [userInStorage, setUserInStorage] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    setUserInStorage(user);
  }, []);

  useEffect(() => {
    // console.log("userInStorage: ", userInStorage)
    localStorage.setItem("user", JSON.stringify(userInStorage));
  }, [userInStorage]);

  return [userInStorage, setUserInStorage];
};

export default useUserLocalStorage;