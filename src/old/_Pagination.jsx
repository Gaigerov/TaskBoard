import React, {useState} from 'react';
import chevronRight from "../../image/ChevronRight.svg";
import chevronLeft from "../../image/ChevronLeft.svg";
import chevronsRight from "../../image/ChevronsRight.svg";
import chevronsLeft from "../../image/ChevronsLeft.svg";
import {CustomSelect} from '../CustomSelect/_CustomSelect';

export const Pagination = ({searchedTasks, tasksPerPage, currentPage, setCurrentPage}) => {
    const [pageInput, setPageInput] = useState('');
    const totalPages = Math.ceil(searchedTasks.length / tasksPerPage);

    if (totalPages === 0) {
        return <div>Tasks not found</div>;
    }


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleInputChange = (event) => {
        const value = event.currentTarget.value;
        if (!isNaN(value) && value > 0 && value <= totalPages) {
            setPageInput(value);
            setCurrentPage(Number(value)); // Перейти на введенную страницу
        } else {
            setPageInput('');
        }
    };

    return (
        <div className='footerContainer'>
            <div className="taskOnPageContainer">
                <p className='labelTasksPerPage' htmlFor="tasksPerPage">Task on page</p>
                <CustomSelect
                    options={[10, 25, 50, 100]}
                    value={tasksPerPage}
                />
            </div>
            <div className="paginationPageNumber">
                <img
                    src={chevronsLeft}
                    onClick={handleFirstPage}
                    style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                />
                <img
                    src={chevronLeft}
                    onClick={handlePrevPage}
                    style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                />
                {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageClick(index + 1)}
                        className={currentPage === index + 1 ? 'active pageActiveNumberButton' : 'pageNumberButton'}
                    >
                        {index + 1}
                    </button>
                ))}
                <img
                    src={chevronRight} onClick={handleNextPage}
                    style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                />
                <img
                    src={chevronsRight} onClick={handleLastPage}
                    style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                />
            </div>
            <div className='pageInputContainer'>
                <p className='labelGoTo'>Go to page</p>
                <input
                    type="text"
                    value={pageInput}
                    onChange={handleInputChange}
                    min="1"
                    max={totalPages}
                    placeholder={currentPage}
                    className="taskOnPageInput"
                />
            </div>
        </div>
    );
};
