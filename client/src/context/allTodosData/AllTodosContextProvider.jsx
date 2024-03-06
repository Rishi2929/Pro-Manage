import React, { useEffect, useState } from 'react';
import AllTodosContext from "./AllTodosContext";
import { server } from '../../main';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// const data = [
//   {
//     _id: "65e47f9e6eea4587960c8c1e",
//     userId: "65e47f8d6eea4587960c8c15",
//     title: "sadf",
//     priority: "high",
//     dueDate: "",
//     status: "backlog",
//     checklist: [
//       {
//         _id: "65e47f9e6eea4587960c8c1d",
//         description: "asdf",
//         isCompleted: false
//       }
//     ],
//     // status: "TO-DO",
//     createdAt: "2024-03-03T13:48:14.190Z",
//     __v: 0
//   },
//   {
//     _id: "65e47fae6eea4587960c8c25",
//     userId: "65e47f8d6eea4587960c8c15",
//     title: "asdfew",
//     priority: "high",
//     status: "done",
//     dueDate: "Thu, 21 Mar 2024 18:30:00 GMT",
//     checklist: [
//       {
//         _id: "65e47fae6eea4587960c8c21",
//         description: "asdf",
//         isCompleted: true
//       },
//       {
//         _id: "65e47fae6eea4587960c8c22",
//         description: "dasf",
//         isCompleted: false
//       },
//       {
//         _id: "65e47fae6eea4587960c8c23",
//         description: "sadfasdf",
//         isCompleted: false
//       },
//       {
//         _id: "65e47fae6eea4587960c8c24",
//         description: "asdfwe",
//         isCompleted: false
//       }
//     ]
//   }
// ];

const AllTodosContextProvider = ({ children }) => {
  const [allTodos, setAllTodos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("thisWeek");
  const [allTodosLoading, setAllTodosLoading] = useState(false);

  const param = useParams();

  useEffect(() => {
    getAllTodos(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    console.log("allllllllllllllllllllllllll: ", param)
    // getAllTodos(selectedFilter);
  }, []);


  const getAllTodos = async (selectedFilter = "thisWeek") => {
    try {
      setAllTodosLoading(true);
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${server}/todo/get-todos`, {
        params: { filter: selectedFilter },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      setAllTodos(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setAllTodosLoading(false);
    }
  };

  return (
    <AllTodosContext.Provider value={{
      allTodos, setAllTodos,
      allTodosLoading, setAllTodosLoading,
      selectedFilter, setSelectedFilter,
      getAllTodos
    }}>
      {children}
    </AllTodosContext.Provider>
  );
};

export default AllTodosContextProvider;