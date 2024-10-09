import React, {useEffect, useRef} from 'react';
import {
    Link,
} from "react-router-dom";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';

export const Modal = ({onClose, onEdit, task, mode, onCreate, onSave, onRemove, onClone}) => {
    const {title, description, date, errors, isDirty, validMode} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const modalRef = useRef(null);

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

    const validate = () => {
        let newErrors = {title: '', description: '', date: ''};
        let isValid = true;

        // Валидация title
        if (!title) {
            newErrors.title = 'Enter the title';
            isValid = false;
        } else if (title.length > 50) {
            newErrors.title = 'Maximum of 50 characters';
            isValid = false;
        } 

        // Валидация description
        if (!description) {
            newErrors.description = 'Enter a description';
            isValid = false;
        } else if (description.length > 200) {
            newErrors.description = 'Maximum of 200 characters';
            isValid = false;
        }

        // Валидация date
        if (!date) {
            newErrors.date = 'Enter the date';
            isValid = false;
        } else {
            const today = new Date();
            const inputDate = new Date(date.split('.').reverse().join('-')); // Преобразуем DD.MM.YYYY в YYYY-MM-DD

            if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
                newErrors.date = 'Enter a valid date';
                isValid = false;
            } else if (inputDate < today) {
                newErrors.date = 'Enter the date that has not passed yet';
                isValid = false;
            }
        }

        setGlobalStore({
            errors: newErrors,
        })

        return isValid;
    };

    useEffect(() => {
        if (mode === 'create' && isDirty === true) {
            isValid = true;
            validate();
        }
    }, [title, description, date]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
            setGlobalStore({
            title: '',
            description: '',
            date: '',
        })
        };
    }

    const handleAction = () => {
        if (mode === 'create' && validate()) {
            onCreate({title, description, date});
            setGlobalStore({
                title: '',
                description: '',
                date: '',
            })

        } else if (mode === 'edit' && validate()) {
            onSave({...task, title, description, date});
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                date: '',
            })
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                date: '',
            })
        }
    }

    const handleClose = (event) => {
        event.preventDefault();
        onClose();
        setGlobalStore({
            title: '',
            description: '',
            date: '',
        });
    };

    const handleRemoveTask = (event) => {
        event.preventDefault();
        onRemove(task.id)
        onClose();
        setGlobalStore({
            title: '',
            description: '',
            date: '',
        })
    }

    const handleCloneTask = () => {
        onClone(task.id);
        onClose();
    }

    useEffect(() => {
        if (mode) {
            document.addEventListener('keydown', handleKeyDown);
        } 
        if (mode === 'view') {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode]);

    useEffect(() => {
        if (mode === 'edit') {
            onSave;
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onEdit]);

    useEffect(() => {
        if (task) {
            setGlobalStore({
                title: task.title,
                description: task.description,
                date: task.date,
            })
        }
    }, [task]);

    const clearFirstFields = () => {
        setGlobalStore({
            title: '',
        })
    }

    const clearSecondFields = () => {
        setGlobalStore({
            description: '',
        })
    }

    const clearThirdFields = () => {
        setGlobalStore({
            date: '',
        })
    }

    if (!mode &&
        !validMode.includes(mode) && 
        !checkTaskIdinUrl()) 
        return null;

    return (
        <div className="modalOverlay">
            <div className={mode === 'remove' ? "modalRemoveContent" : "modalContent"} ref={modalRef}>
                {mode === 'remove' ? (
                    <>
                        <div className="modalHeader">
                            <h2 className="modalHeaderName">Remove Task</h2>
                            <FontAwesomeIcon
                                className="modalCloseButton"
                                onClick={handleClose}
                                icon={faXmark}
                            />
                        </div>
                        <div className="modalModeText">
                            <p className="modalRemoveParagraph">Are you sure you want to delete the task "<span className="modalBoldText">{task.title}</span>"?</p>
                        </div>
                        <div className="modalButtons">
                            <button className="btn modalRemoveButton" onClick={handleRemoveTask}>Remove</button>
                            <button className="btn modalCancelButton" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modalHeader">
                            <h2 className="modalHeaderName">{mode === 'view' ? task.title : mode === 'edit' ? 'Edit Task' : 'Create Task'}</h2>
                            <FontAwesomeIcon
                                className="modalCloseButton"
                                onClick={handleClose}
                                icon={faXmark}
                            />
                        </div>
                    </>)}
                {mode === 'view' && (
                    <>
                        <div className="modalModeText">
                            <p className="modalModeText__description">{task.description}</p>
                            <p className="modalModeText__date">{task.date}</p>
                        </div>
                        <div className="modalButtons">
                            <Link to={`edit?id=${task.id}`} className="btn modalEditfromViewButton" onClick={() => onEdit(task)}>Edit</Link>
                            <button className="btn modalCloneButton" onClick={handleCloneTask}>Copy</button>
                            <button className="btn modalCancelButton" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                )}
                {mode === 'edit' && (
                    <>
                        <label>Title
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    name="title"
                                    className="modalInput"
                                    value={title}
                                    onChange={(event) => setGlobalStore({title: event.target.value,})}
                                    placeholder="Enter title"
                                    style={{
                                        borderColor: errors.title ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                                <FontAwesomeIcon
                                    className="inputClearButton"
                                    onClick={clearFirstFields}
                                    icon={faXmark}
                                />
                            </div>
                            {errors.title && <span style={{color: 'red'}}>{errors.title}</span>}
                        </label>
                        <label>Description
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    name="description"
                                    className="modalInput"
                                    value={description}
                                    onChange={(event) => setGlobalStore({description: event.target.value,})}
                                    placeholder="Enter description"
                                    style={{
                                        borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                                <FontAwesomeIcon
                                    className="inputClearButton"
                                    onClick={clearSecondFields}
                                    icon={faXmark}
                                />
                            </div>
                            {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}
                        </label>
                        <label>Date
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    name="date"
                                    className="modalInput"
                                    value={date}
                                    onChange={(event) => setGlobalStore({date: event.target.value,})}
                                    placeholder="DD.MM.YYYY"
                                    style={{
                                        borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                                <FontAwesomeIcon
                                    className="inputClearButton"
                                    onClick={clearThirdFields}
                                    icon={faXmark}
                                />
                            </div>
                            {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}
                        </label>
                        <div className="modalButtons">
                            <button className="btn modalEditButton" onClick={handleAction}>Save</button>
                            <button className="btn modalCancelButton" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                )}
                {mode === 'create' && (
                    <>
                        <label>Title
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    className="modalInput"
                                    value={title}
                                    onChange={(event) => setGlobalStore({title: event.target.value,})}
                                    placeholder="Enter title"
                                    style={{
                                        borderColor: errors.title ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                            </div>
                            {errors.title && <span style={{color: 'red'}}>{errors.title}</span>}
                        </label>
                        <label>Description
                            <div className="inputContainer">
                                <input
                                    className="modalInput"
                                    value={description}
                                    onChange={(event) => setGlobalStore({description: event.target.value,})}
                                    placeholder="Enter description"
                                    style={{
                                        borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                            </div>
                            {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}
                        </label>
                        <label>Date
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    className="modalInput"
                                    value={date}
                                    onChange={(event) => setGlobalStore({date: event.target.value,})}
                                    placeholder="DD.MM.YYYY"
                                    style={{
                                        borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
                                    }}
                                />
                            </div>
                            {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}
                        </label>
                        <div className="modalButtons">
                            <button className="btn modalCreateButton" onClick={handleAction}>Create</button>
                            <button className="btn modalCancelButton" onClick={handleClose}>Cancel</button>
                        </div>
                    </>
                )}
            </div >
        </div >
    );
};
