import React, { useEffect, useState } from 'react';

const useTodosLocalStorage = () => {
    const [todosInStorage, setTodosInStorage] = useState([]);

    useEffect(() => {
        const todos = JSON.parse(localStorage.getItem("allTodos")) || null;
        setTodosInStorage(todos);
    }, []);

    useEffect(() => {
        localStorage.setItem("allTodos", JSON.stringify(todosInStorage));
    }, [todosInStorage]);

    return [todosInStorage, setTodosInStorage];
};

export default useTodosLocalStorage;