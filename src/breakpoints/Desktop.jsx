import React from 'react';
import {VALID_MODE} from '../constant';
import {Table} from '../components/Table';
import {
    useNavigate,
} from "react-router-dom";

export const Desktop = ({task, tasks, onView, onEdit, onClone, onDelete, currentTaskId}) => {

    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    params.set("id", task.id);
    params.toString();

    return (
        <div className="taskContainer">
            <div className="taskContent"
            >
                {tasks.map((task) => (
                    <Table
                        task={task}
                        tasks={tasks}
                        onView={onView}
                        onEdit={onEdit}
                        onClone={onClone}
                        onDelete={onDelete}
                        currentTaskId={currentTaskId}
                    />
            ))}
            </div>
        </div>
    );
}
