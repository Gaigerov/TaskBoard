import React, {useState, useEffect} from 'react';
import {
    Link,
    useParams,
    useNavigate,
    useLocation,
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
    const {tasks} = state;

    const {mode} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const taskIdFromUrl = new URLSearchParams(location.search).get('id'); 
    
    const [currentTaskId, setCurrentTaskId] = useState(null)

    const checkTaskIdinUrl = () => {
        const tasksJson = localStorage.getItem('tasks');  // получили из localStorage массив тасок и положили в переменную tasksJson
        const tasks = tasksJson ? JSON.parse(tasksJson) : []; // при наличии массива тасок парсим его и кладем в переменную tasks, в противном случае пустой массив в tasks

        const taskExists = tasks.some(t => t.id.toString() === taskIdFromUrl); // проверяем у каждого компонента Task task.id из localStorage и сравниваем с тем id который в url
        if (!taskExists) { //если taskExist возвращает false
            console.log('Такого id не существует. Переход не возможен'); // консолим
            closeModal()
            return true; // возвращаем булевое значение true
        }
        return false; // возвращаем булевое значение false
    }

    useEffect(() => {
        const isInvalidTaskId = checkTaskIdinUrl();
        if (!isInvalidTaskId) {
            setCurrentTaskId(taskIdFromUrl); // Устанавливаем текущий id задачи, если он валиден
        }
    }, [taskIdFromUrl]);


    const closeModal = () => {
        setCurrentTaskId(null);
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
        setCurrentTaskId(null);
        navigate('create');
    };

    const openEditModal = (task) => {
        setCurrentTaskId(task.id);
    };

    const openViewModal = (task) => {
        setCurrentTaskId(task.id);
    };

    const openRemoveModal = (task) => {
        setCurrentTaskId(task.id);
        navigate(`remove/${task.id}`);
    };


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
                            currentTaskId={currentTaskId}
                        />
                    ))}
                </div>
            </div>
            {checkTaskIdinUrl && (
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
            )}   
        </div>
    );
};
