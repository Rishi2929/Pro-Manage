import React, { useState } from 'react'
import AllTodosContext from "./AllTodosContext";

const data = [
  {
    _id: "65e47f9e6eea4587960c8c1e",
    userId: "65e47f8d6eea4587960c8c15",
    title: "sadf",
    priority: "high",
    dueDate: "",
    status: "todo",
    checklist: [
      {
        _id: "65e47f9e6eea4587960c8c1d",
        description: "asdf",
        isCompleted: false
      }
    ],
    // status: "TO-DO",
    createdAt: "2024-03-03T13:48:14.190Z",
    __v: 0
  },
  {
    _id: "65e47fae6eea4587960c8c25",
    userId: "65e47f8d6eea4587960c8c15",
    title: "asdfew",
    priority: "high",
    status: "todo",
    dueDate: "Thu, 21 Mar 2024 18:30:00 GMT",
    checklist: [
      {
        _id: "65e47fae6eea4587960c8c21",
        description: "asdf",
        isCompleted: true
      },
      {
        _id: "65e47fae6eea4587960c8c22",
        description: "dasf",
        isCompleted: false
      },
      {
        _id: "65e47fae6eea4587960c8c23",
        description: "sadfasdf",
        isCompleted: false
      },
      {
        _id: "65e47fae6eea4587960c8c24",
        description: "asdfwe",
        isCompleted: false
      }
    ]
  }
];

const AllTodosContextProvider = ({children}) => {
    const [allTodos, setAllTodos] = useState(data);

  return (
    <AllTodosContext.Provider value={{
        allTodos, setAllTodos
    }}>
        {children}
    </AllTodosContext.Provider>
  )
}

export default AllTodosContextProvider