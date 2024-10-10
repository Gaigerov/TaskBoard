import React from 'react';
import {
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";

import './config/App.css';

import {Task} from './Task';
import {Modal} from './Modal';

import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';

const plus = require('../src/image/plus.svg');

export const TaskBoard = () => {
    const setGlobalStore = useSetGlobalStore();

    const state = useGlobalStore();
    const {tasks, currentTaskId} = state;

    const {mode} = useParams();
    const navigate = useNavigate();

    const closeModal = () => {
        setGlobalStore({
            currentTaskId: null,
        });
        navigate('/')
    };

    const handleCreateTask = (newTask) => {
        const taskWithId = {...newTask, id: Date.now()}; // Генерация уникального ID
        const updatedTasks = [...tasks, taskWithId];
        setGlobalStore({
            tasks: updatedTasks,
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        closeModal();
    };

    const cloneTask = (id) => {
        const taskToClone = tasks.find(task => task.id === id);
        if (taskToClone) {
            const newTask = {
                ...taskToClone,
                title: taskToClone.title + ' Copy',
                id: Date.now()
            };
            const updatedTasks = [...tasks, newTask];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setGlobalStore({
                tasks: [...tasks, newTask],
            });
        };
    };

    const handleEditTask = (updatedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setGlobalStore({
            tasks: updatedTasks,
        });
        closeModal();
    };

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setGlobalStore({
            tasks: updatedTasks,
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        closeModal();
    };

    const openCreateModal = () => {
        setGlobalStore({
            currentTaskId: null,
        });
        navigate('create');
    };

    const openEditModal = (task) => {
        setGlobalStore({
            currentTaskId: task.id,
        });
        navigate(`edit/${task.id}`);
    };

    const openViewModal = (task) => {
        setGlobalStore({
            currentTaskId: task.id,
        });
    };

    const openRemoveModal = (task) => {
        setGlobalStore({
            currentTaskId: task.id,
        });
        navigate(`remove/${task.id}`);
    };

    const checkTaskIdinUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const taskIdFromUrl = urlParams.get('id');
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];

        const taskExists = tasks.some(task => task.id === taskIdFromUrl);
        if (!taskExists) {
            console.log('Такого id не существует. Переход не возможен');
            return false;
        }
        return true;
    }

    return (
        <div className="taskBoard">
            <div className="createButtonContainer">
                <Link className="btn createButton" to="/create" onClick={openCreateModal}>
                    <img className="plusButton" src={plus} />
                    Create
                </Link>
            </div>
            <div className="titlesContainer">
                <div className="titlesNames">Title</div>
                <div className="titlesNames">Description</div>
                <div className="titlesNames">Date</div>
            </div>
            <div className="tasksContainer">
                <div className="tasksContainer__scroller">
                    {tasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task}
                            onView={() => openViewModal(task)}
                            onEdit={() => openEditModal(task)}
                            onClone={cloneTask}
                            onDelete={() => openRemoveModal(task)}
                        />
                    ))}
                </div>
            </div>
            <Modal
                task={tasks.find(t => t.id === currentTaskId)}
                mode={mode}
                onCreate={handleCreateTask}
                onSave={handleEditTask}
                onEdit={openEditModal}
                onRemove={handleDeleteTask}
                onClose={closeModal}
                onClone={cloneTask}
            />
        </div>
    );
};
