import React, {useEffect} from "react";
import {useGlobalStore} from "../../GlobalStoreContext";
import {useSetGlobalStore} from "../../GlobalStoreContext";
import xButton from "../../image/x.svg";
import {VALID_MODE} from "../../constant";

export const FormBody = ({mode}) => {
    const {title, description, time, date, errors, isDirty, status} = useGlobalStore();
    const setGlobalStore = useSetGlobalStore();

    const clearField = (field) => {
        setGlobalStore({[field]: ""});
    };
    const makeSetField = (field) => (event) => {
        setGlobalStore({
            [field]: event.target.value,
        });
    };
    useEffect(() => {
        if (mode === VALID_MODE.CREATE && isDirty === true) {
            validate();
        }
    }, [title, description, time, date]);

    return (
        <div>
            {mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT && (
                <>
                    <label>Title
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={title ?? ""}
                                placeholder="Enter title"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                }}
                                onChange={makeSetField("title")}
                            />
                            <img
                                className="inputClearButton"
                                src={xButton}
                                onClick={() => clearField("title")}
                            />
                        </div>
                        {errors.description && (
                            <span style={{color: "red"}}>{errors.title}</span>
                        )}
                    </label>
                    <label>Description
                        <div className="inputContainer">
                            <input
                                type="text"
                                value={description ?? ""}
                                placeholder="Enter description"
                                className="modalInput"
                                style={{
                                    borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                }}
                                onChange={makeSetField("description")}
                            />
                            <img
                                className="inputClearButton"
                                src={xButton}
                                onClick={() => clearField("description")}
                            />
                        </div>
                        {errors.description && (
                            <span style={{color: "red"}}>{errors.description}</span>
                        )}
                    </label>
                    <div className='taskDateAndTimeContainer'>
                        <label className="modalContainer__time">Time
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    value={time}
                                    placeholder="00:00"
                                    className="modalInput modalInput__time"
                                    style={{
                                        borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                    }}
                                    onChange={(event) => setGlobalStore({time: event.target.value, })}
                                />
                            </div>
                            {errors.time && <span style={{color: "red"}}>{errors.time}</span>}
                        </label>
                        <label className="modalContainer__date">Date
                            <div className="inputContainer">
                                <input
                                    type="text"
                                    value={date}
                                    placeholder="DD.MM.YYYY"
                                    className="modalInput"
                                    style={{
                                        borderColor: errors.date ? "var(--danger)" : "var(--light-grey)",
                                    }}
                                    onChange={(event) => setGlobalStore({date: event.target.value, })}
                                />
                            </div>
                            {errors.date && <span style={{color: "red"}}>{errors.date}</span>}
                        </label>
                    </div>
                </>
            )}
            {mode === VALID_MODE.VIEW || mode === VALID_MODE.FILTER && (
                <div>{status}
                </div>
            )}
        </div>
    );
};
