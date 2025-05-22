import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTask, retrieveTask, updateTask, deleteTask, changeStatus, retrieveStatus } from "../api/Api";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Logout from "./Logout";


const Task = () => {
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);
    const [submit, setSubmit] = useState(() => {
        const data = localStorage.getItem('task')
        const parsed = data ? JSON.parse(data) : [];
        return Array.isArray(parsed) ? parsed : [];
    })
    const [error, setError] = useState('')
    const [isediting, setIsEditing] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [search, setSearch] = useState('')
    const [sortOption, setSortOption] = useState('All');
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token not found. Please log in again.');
            return;
        }

        const taskDetails = async () => {
            try {
                const data = await retrieveTask(token);
                if (data.code === 200) {
                    setSubmit(data.data.taskData);
                }
            } catch (error) {
                if (error.code === 400) {
                    setError(error.message);
                    toast.error(error.message, {
                        style: {
                            border: '1px solid #007bff',
                            padding: '16px',
                            color: '#007bff',
                            background: '#e6f0ff',
                            fontWeight: 'bold',
                            fontSize: "15px"
                        }
                    })
                }
            }
        }
        taskDetails();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (task.trim() === '') {
            setError('Task is required');
            return;
        }
        if (isediting) {

            const updatedItem = {
                task,
                description,
                date,
            };

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) {
                setError('No token found. Please log in again.');
                return;
            }

            try {
                const data = await updateTask(token, editIndex, updatedItem);
                if (data.code === 200) {
                    toast.success(data.message, {
                        style: {
                            border: '1px solid #007bff',
                            padding: '16px',
                            color: '#007bff',
                            background: '#e6f0ff',
                            fontWeight: 'bold',
                            fontSize: "15px"
                        }
                    });

                    const updated = submit.map((item) =>
                        item._id === editIndex ? { ...item, ...updatedItem } : item
                    );

                    setSubmit(updated)
                    setIsEditing(false)
                    setEditIndex(null)
                }
            } catch (error) {
                console.log(error, 'error');

            }

            // const updated = submit.map((item) =>
            //     item.id === editIndex ? { ...item, task, description: description, date } : item
            // );
            // setSubmit(updated)
            // setIsEditing(false)
            // setEditIndex(null)

        } else {
            const newTask = {
                id: new Date().getTime().toString(),
                task: task,
                description: description,
                date: date
            }

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) {
                setError('No token found. Please log in again.');
                return;
            }

            const data = await createTask(token, newTask)
            if (data.code === 201) {
                const updateTask = [...submit, data.data.taskData]
                setSubmit(updateTask)
                // localStorage.setItem('task', JSON.stringify(updateTask));
                // setSubmit([...submit, updateTask])
                toast.success(data.message, {
                    style: {
                        border: '1px solid #007bff',
                        padding: '16px',
                        color: '#007bff',
                        background: '#e6f0ff',
                        fontWeight: 'bold',
                        fontSize: "15px"
                    }
                })
            }
            // setSubmit([...submit, newTask])
            // localStorage.setItem('task', JSON.stringify([...submit, newTask]));
        }
        setTask('');
        setDescription('');
        setDate(null);
        setError('')
    }

    const handleEdit = async (item, id) => {
        // const taskToEdit = item.find((i) => i._id === id)
        setTask(item.task)
        setDescription(item.description)
        setDate(new Date(item.date));
        setIsEditing(true)
        setEditIndex(id)
    }

    const handleDelete = async (id) => {
        // const updatedTasks = submit.filter((item) => item.id !== id)
        // setSubmit(updatedTasks)
        // localStorage.removeItem('task')
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            setError('No token found. Please log in again.');
            return;
        }

        const data = await deleteTask(token, id);
        if (data.code === 200) {
            toast.success(data.message, {
                style: {
                    border: '1px solid #007bff',
                    padding: '16px',
                    color: '#007bff',
                    background: '#e6f0ff',
                    fontWeight: 'bold',
                    fontSize: "15px"
                }
            });
            setSubmit((prev) => prev.filter((item) => item._id !== id))
        }
    }

    const handleCompleted = async (id, newStatus) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            setError('No token found. Please log in again.');
            return;
        }

        const data = await changeStatus(id, newStatus, token);
        if (data.code === 200) {
            //     const updatedTasks = submit.map((item) => {
            //     if (item.id === id) {
            //         return { ...item, completed: !item.completed }
            //     }
            //     return item;
            // });

            // const updatedTasks = submit.map((task) =>
            //     task.id === id ? { ...task, status: newStatus } : task
            // );
            const updatedTasks = submit.map((item) => {
                if (item._id === id) {
                    return { ...item, status: newStatus }
                }
                return item;
            });
            setSubmit(updatedTasks);
            toast.success(data.message, {
                style: {
                    border: '1px solid #007bff',
                    padding: '16px',
                    color: '#007bff',
                    background: '#e6f0ff',
                    fontWeight: 'bold',
                    fontSize: "15px"
                }
            })
        }
    }

    const handleSortChange = async (e) => {
        const selectedOption = e.target.value;
        setSortOption(selectedOption);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. please log in again....');
            return;
        }

        try {
            const response = await retrieveStatus(token, selectedOption);
            if (response.code === 200) {
                setSubmit(response.data.taskData);
            } else {
                setError(response.message);
                toast.error(response.message, {
                    style: {
                        border: '1px solid #007bff',
                        padding: '16px',
                        color: '#007bff',
                        background: '#e6f0ff',
                        fontWeight: 'bold',
                        fontSize: "15px"
                    }
                })
            }
        } catch (error) {
            console.error('Error fetching tasks by status:', error);
            setError('An error occurred while fetching tasks. Please try again.');
        }
    }

    const searchTask = (value) => {
        setSearch(value);
    }

    const finalTasks = submit
        .filter((item) => {
            return item.task && item.task.toLowerCase().includes(search.toLowerCase());
        })
        .filter((item) => {
            if (sortOption === 'completed') {
                return item.completed;
            }
            if (sortOption === 'pending') {
                return !item.completed;
            }
            return true;
        })

    // return (
    //     <>
    //         <h1>Task Management</h1>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Task:</label>
    //                 <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter Your task" />
    //                 {error && <p>{error}</p>}
    //             </div>
    //             <div>
    //                 <label>Description (optional):</label>
    //                 <input type="text" value={Description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Your Description" />
    //             </div>
    //             <div>
    //                 <label>Date:</label>
    //                 <DatePicker selected={date} onChange={(date) => setDate(date)} placeholderText="Select Due Date" dateFormat='dd/MM/yyyy' minDate={new Date()} />
    //                 {error && <p>{error}</p>}
    //             </div>

    //             <button type="submit" disabled={!task || !date}>Add Task</button>
    //         </form>

    //         <div>
    //             <input type="text" value={search} onChange={(e) => searchTask(e.target.value)} placeholder="Search tasks" />
    //         </div>

    //         <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
    //             <option value="All">All</option>
    //             <option value="Completed">Completed</option>
    //             <option value="Pending">Pending</option>
    //         </select>
    //         {finalTasks.length > 0 ? (
    //             <ul>
    //                 {
    //                     finalTasks.map((item) => (
    //                         <li key={item.id}>
    //                             <h2>{item.task}</h2>
    //                             <p>{item.description}</p>
    //                             <p>{item.date ? new Date(item.date).toLocaleDateString() : 'No date set'}</p>
    //                             <button onClick={() => handleEdit(item.id)}>Edit</button>
    //                             <button onClick={() => handleDelete(item.id)}>Delete</button>
    //                             <button onClick={() => handleCompleted(item.id)}>{item.completed ? 'undo' : 'Mark as Completed'}</button>
    //                         </li>
    //                     ))
    //                 }
    //             </ul>
    //         ) : (
    //             <p>No task left</p>
    //         )}
    //     </>
    // )

    // return (
    //     <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
    //         <h1 style={{ textAlign: "center" }}>📝 Task Manager</h1>

    //         {/* Task Form */}
    //         <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
    //             <input
    //                 type="text"
    //                 value={task}
    //                 onChange={(e) => setTask(e.target.value)}
    //                 placeholder="Task name"
    //                 style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
    //             />
    //             <input
    //                 type="text"
    //                 value={Description}
    //                 onChange={(e) => setDescription(e.target.value)}
    //                 placeholder="Description (optional)"
    //                 style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
    //             />
    //             <DatePicker
    //                 selected={date}
    //                 onChange={(d) => setDate(d)}
    //                 placeholderText="Select due date"
    //                 dateFormat="dd/MM/yyyy"
    //                 minDate={new Date()}
    //                 style={{ width: "100%" }}
    //             />
    //             {error && <p style={{ color: "red" }}>{error}</p>}
    //             <button type="submit" style={{ marginTop: "0.5rem" }}>
    //                 {isediting ? "Update Task" : "Add Task"}
    //             </button>
    //         </form>

    //         {/* Search and Filter */}
    //         <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
    //             <input
    //                 type="text"
    //                 value={search}
    //                 onChange={(e) => setSearch(e.target.value)}
    //                 placeholder="Search tasks"
    //                 style={{ flex: 1, padding: "0.5rem" }}
    //             />
    //             <select
    //                 value={sortOption}
    //                 onChange={(e) => setSortOption(e.target.value)}
    //                 style={{ padding: "0.5rem" }}
    //             >
    //                 <option value="All">All</option>
    //                 <option value="Completed">Completed</option>
    //                 <option value="Pending">Pending</option>
    //             </select>
    //         </div>

    //         {/* Task List */}
    //         {finalTasks.length > 0 ? (
    //             <ul style={{ listStyle: "none", padding: 0 }}>
    //                 {finalTasks.map((t) => (
    //                     <li
    //                         key={t.id}
    //                         style={{
    //                             border: "1px solid #ccc",
    //                             borderRadius: "5px",
    //                             padding: "1rem",
    //                             marginBottom: "1rem",
    //                             background: t.completed ? "#d4edda" : "#f8f9fa",
    //                         }}
    //                     >
    //                         <h3>{t.task}</h3>
    //                         {t.description && <p>{t.description}</p>}
    //                         {t.date && <p>Due: {new Date(t.date).toLocaleDateString()}</p>}
    //                         <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
    //                             <button onClick={() => handleEdit(t.id)}>Edit</button>
    //                             <button onClick={() => handleDelete(t.id)}>Delete</button>
    //                             <button onClick={() => toggleCompleted(t.id)}>
    //                                 {t.completed ? "Undo" : "Complete"}
    //                             </button>
    //                         </div>
    //                     </li>
    //                 ))}
    //             </ul>
    //         ) : (
    //             <p style={{ textAlign: "center" }}>No tasks found.</p>
    //         )}
    //     </div>
    // );

    return (
        <>
            <style>{`
            body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg,rgb(76, 107, 241) 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: Arial, sans-serif;
            overflow:hidden
        }
            .container {
              max-width: 600px;
              margin: 2rem auto;
              padding: 2rem;
              background: #fdfdfd;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              border-radius: 10px;
              font-family: Arial, sans-serif;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 2rem;
              color: #333;
              margin-bottom: 1rem;
            }
            .header button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #dc3545;
            color: white;
            }
            .header button:hover {
            background-color: #b02a37;
            }
            
            .back-button img {
              height:30px;
              width:30px;
            }
            .form input, .form select {
              width: 100%;
              padding: 0.6rem;
              margin: 0.5rem 0;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 1rem;
            }
            .form button {
              width: 100%;
              padding: 0.7rem;
              background-color: #007bff;
              border: none;
              color: white;
              font-size: 1rem;
              border-radius: 5px;
              cursor: pointer;
            }
            .form button:hover {
              background-color: #0056b3;
            }
            .task-list {
              margin-top: 2rem;
              overflow: auto;
              max-height: 400px;
            }
            .task-item {
              background: #fff;
              padding: 1rem;
              margin-bottom: 1rem;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              border-left: 6px solid #007bff;
            }
            .task-item.completed {
              border-left: 6px solid #28a745;
              background: #e9f7ef;
            }
            .task-item h3 {
              margin: 0 0 0.5rem 0;
            }
            .task-item p {
              margin: 0.3rem 0;
            }
            .task-actions {
              display: flex;
              gap: 0.5rem;
              margin-top: 0.5rem;
            }
            .task-actions button {
              flex: 1;
              padding: 0.5rem;
              font-size: 0.9rem;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            .task-actions .edit {
              background: #ffc107;
              color: #000;
            }
            .task-actions .delete {
              background: #dc3545;
              color: white;
            }
            .task-actions .toggle {
              background: #28a745;
              color: white;
            }
            .search-sort {
              display: flex;
              gap: 1rem;
              margin-top: 1rem;
            }
            .search-sort input, .search-sort select {
              flex: 1;
              padding: 0.6rem;
              font-size: 1rem;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .no-task {
              text-align: center;
              color: #888;
              margin-top: 2rem;
            }
          `}</style>

            <div className="container">
                <div className="header-left">
                    <button className="back-button" onClick={handleBack}>
                        <img src="/public/icons8-back-button.gif" alt="back" />
                    </button>
                </div>
                < Toaster position="top-right" />
                <div className="header">

                    <span>📝 Task Manager</span>
                    < Logout />
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Task name"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        placeholderText="Select due date"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        className="date-picker"
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">{isediting ? "Update Task" : "Add Task"}</button>
                </form>

                <div className="search-sort">
                    <input
                        type="text"
                        placeholder="Search task..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={sortOption}
                        // onChange={(e) => setSortOption(e.target.value)}
                        onChange={handleSortChange}
                    >
                        <option value="All">All</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="task-list">
                    {finalTasks.length > 0 ? (
                        finalTasks.map((item) => (
                            <div
                                className={`task-item ${item.completed ? "completed" : ""}`}
                                key={item._id}
                            >
                                <h3>{item.task}</h3>
                                {item.description && <p>{item.description}</p>}
                                <p>
                                    Due Date:{" "}
                                    {item.date
                                        ? new Date(item.date).toLocaleDateString()
                                        : "Not set"}
                                </p>
                                <div className="task-actions">
                                    <button className="edit" onClick={() => handleEdit(item, item._id)}>
                                        Edit
                                    </button>
                                    <button
                                        className="delete"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="toggle"
                                        onClick={() => handleCompleted(item._id, item.status === 'completed' ? 'pending' : 'completed')}
                                    >
                                        {item.status === 'completed' ? 'completed' : 'pending'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-task">No tasks found</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Task;