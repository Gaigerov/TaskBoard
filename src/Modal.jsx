import React, {useEffect, useRef, useState} from 'react';
import {
    Link,
    useSearchParams,
} from "react-router-dom";


import {useGlobalStore} from './GlobalStoreContext';
import {useSetGlobalStore} from './GlobalStoreContext';
import {VALID_MODE, VALID_MODES} from './constant';
import {Button} from './components/Button';
import xButton from './image/x.svg';



export const Modal = ({onClose, onEdit, task, mode, onCreate, onSave, onRemove, onClone}) => {
    const {title, description, time, date, errors, isDirty, tasks} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1200);

    const handleResize = () => {
        setIsWideScreen(window.innerWidth > 1200);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Удаляем обработчик события при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const modalRef = useRef(null);

    const [searchParams, setParams] = useSearchParams();
    const id = searchParams.get('id'); // находим по параметру id значение и записываем в переменную id

    const isValidId = () => {
        return tasks.some(t => t.id.toString() === id); // проходим по массиву tasks который у нас хранится в глобальном сторе, сверяем id каждой задачи с id полученным из url и возвращаем true/false
    };

    const isShow = (() => {
        if (mode === VALID_MODE.CREATE) { // возвращаем true если mode(полученный из url) = 'create'
            return true;
        }

        if (VALID_MODES.some(m => m === mode) && isValidId()) { // возвращаем true если хоть один элемент массива validMode равен mode(полученный из url) и функция isValidId вернула true
            return true;
        }
        return false; // иначе false
    })();

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
            newErrors.description = 'Enter description';
            isValid = false;
        } else if (description.length > 200) {
            newErrors.description = 'Maximum of 200 characters';
            isValid = false;
        }

        // Валидация time
        if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) {
            newErrors.time = 'Enter time';
            isValid = false;
        }

        // Валидация date
        if (!date) {
            newErrors.date = 'Enter date';
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
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, date]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })
        };
    }

    const handleSubmit = () => {
        if (mode === VALID_MODE.CREATE && validate()) {
            onCreate({title, description, time, date});
            setGlobalStore({
                title: '',
                description: '',
                time: '',
                date: '',
            })

        } else if (mode === VALID_MODE.EDIT && validate()) {
            onSave({...task, title, description, time, date});
            onClose();
            setGlobalStore({
                title: '',
                description: '',
                time: '',
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
                time: '',
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
            time: '',
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
            time: '',
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
        if (mode === VALID_MODE.VIEW) {
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
        if (mode === VALID_MODE.EDIT) {
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
                time: task.time,
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
            time: '',
        })
    }

    const clearFourthFields = () => {
        setGlobalStore({
            date: '',
        })
    }


    if (!isShow) {
        console.log('Некорректный режим')
        return null;
    }

    return (
        <div>
            <div className="modalOverlay">
                <div className={mode === VALID_MODE.REMOVE ? "modalRemoveContent" : "modalContent"} ref={modalRef}>
                    {mode === VALID_MODE.REMOVE ? (
                        <>
                            <div className='modalRectangle'>
                                <div className='rectangle'></div>
                            </div>
                            <div className="modalHeader">
                                <h2 className="modalHeaderName">Remove Task</h2>
                                <img className="modalCloseButton" src={xButton} onClick={handleClose} />
                            </div>
                            {!isWideScreen && (
                                <div className="modalModeText">
                                    <p className="modalRemoveParagraph">Are you sure you want to delete the task "<span className="modalBoldText">{task.title}</span>"?</p>
                                </div>
                            )}

                            <div className="modalButtons">
                                <Button
                                    type="remove"
                                    onClick={handleRemoveTask}
                                    name="Remove"
                                />
                                <Button
                                    type="cancel"
                                    onClick={handleClose}
                                    name="Cancel"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='modalRectangle'>
                                <div className='rectangle'></div>
                            </div>
                            <div className="modalHeader">
                                <h2 className="modalHeaderName">{mode === VALID_MODE.VIEW ? task.title : mode === VALID_MODE.EDIT ? 'Edit Task' : 'Create Task'}</h2>
                                <img className="modalCloseButton" src={xButton} onClick={handleClose} />
                            </div>
                        </>)}
                    {mode === VALID_MODE.VIEW && (
                        <>
                            <div className="modalModeText">
                                <p className="modalModeText__description">{task.description}</p>
                                <div className='modalModeDate'>
                                    <p className="modalModeText__time">{task.time}</p>
                                    <p className="modalModeText__date">{task.date}</p>
                                </div>
                            </div>
                            <div className="modalButtons">
                                <Link to={`edit?id=${task.id}`} className="btn Button_edit" onClick={() => onEdit(task)}>Edit</Link>
                                <Button
                                    type="clone"
                                    onClick={handleCloneTask}
                                    name="Clone"
                                />
                                <Button
                                    type="cancel"
                                    onClick={handleClose}
                                    name="Cancel"
                                />
                            </div>
                        </>
                    )}
                    {mode === VALID_MODE.EDIT && (
                        <>
                            <label>Title
                                <div className="inputContainer">
                                    <input
                                        type="text"
                                        name="title"
                                        className="modalInput"
                                        value={title}
                                        onChange={(event) => setGlobalStore({title: event.target.value, })}
                                        placeholder="Enter title"
                                        style={{
                                            borderColor: errors.title ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                    <img className="inputClearButton" src={xButton} onClick={clearFirstFields} />
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
                                        onChange={(event) => setGlobalStore({description: event.target.value, })}
                                        placeholder="Enter description"
                                        style={{
                                            borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                    <img className="inputClearButton" src={xButton} onClick={clearSecondFields} />
                                </div>
                                {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}
                            </label>
                            <label>Time
                                <div className="inputContainer">
                                    <input
                                        type="text"
                                        name="time"
                                        className="modalInput"
                                        value={time}
                                        onChange={(event) => setGlobalStore({time: event.target.value, })}
                                        placeholder="00:00"
                                        style={{
                                            borderColor: errors.time ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                    <img className="inputClearButton" src={xButton} onClick={clearThirdFields} />
                                </div>
                                {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}
                            </label>
                            <label>Date
                                <div className="inputContainer">
                                    <input
                                        type="text"
                                        name="date"
                                        className="modalInput"
                                        value={date}
                                        onChange={(event) => setGlobalStore({date: event.target.value, })}
                                        placeholder="DD.MM.YYYY"
                                        style={{
                                            borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                    <img className="inputClearButton" src={xButton} onClick={clearFourthFields} />
                                </div>
                                {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}
                            </label>
                            <div className="modalButtons">
                                <Button
                                    type="save"
                                    onClick={handleSubmit}
                                    name="Save"
                                />
                                <Button
                                    type="cancel"
                                    onClick={handleClose}
                                    name="Cancel"
                                />
                            </div>
                        </>
                    )}
                    {mode === VALID_MODE.CREATE && (
                        <>
                            <label>Title
                                <div className="inputContainer">
                                    <input
                                        type="text"
                                        className="modalInput"
                                        value={title}
                                        onChange={(event) => setGlobalStore({title: event.target.value, })}
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
                                        onChange={(event) => setGlobalStore({description: event.target.value, })}
                                        placeholder="Enter description"
                                        style={{
                                            borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                </div>
                                {errors.description && <span style={{color: 'red'}}>{errors.description}</span>}
                            </label>
                            <label>Time
                                <div className="inputContainer">
                                    <input
                                        className="modalInput"
                                        value={time}
                                        onChange={(event) => setGlobalStore({time: event.target.value, })}
                                        placeholder="00:00"
                                        style={{
                                            borderColor: errors.time ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                </div>
                                {errors.time && <span style={{color: 'red'}}>{errors.time}</span>}
                            </label>
                            <label>Date
                                <div className="inputContainer">
                                    <input
                                        type="text"
                                        className="modalInput"
                                        value={date}
                                        onChange={(event) => setGlobalStore({date: event.target.value, })}
                                        placeholder="DD.MM.YYYY"
                                        style={{
                                            borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)',
                                        }}
                                    />
                                </div>
                                {errors.date && <span style={{color: 'red'}}>{errors.date}</span>}
                            </label>
                            <div className="modalButtons">
                                <Button
                                    type="create"
                                    onClick={handleSubmit}
                                    name="Create"
                                />
                                <Button
                                    type="cancel"
                                    onClick={handleClose}
                                    name="Cancel"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
