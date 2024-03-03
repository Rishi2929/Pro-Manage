import React, { useState } from 'react'
import AllTodosContext from "./AllTodosContext";


const AllTodosContextProvider = ({children}) => {
    const [allTodos, setAllTodos] = useState([]);

  return (
    <AllTodosContext.Provider value={{
        allTodos, setAllTodos
    }}>
        {children}
    </AllTodosContext.Provider>
  )
}

export default AllTodosContextProvider