import { useState } from "react"

import buttonArrow from "../../images/svg/button_arrow.svg";

interface GridProps {
    children: React.ReactNode;
}

const getPages = (currentPage, totalElements, totalPages) => {
    let array = []
    for (let i = 1; i <= totalPages; i++) {
        if (i == 1 || i == totalPages || 
            (currentPage < totalElements - 2 && i <= totalElements - 2) ||
            (i >= currentPage - 1 && i <= currentPage + 1) ||
            (totalPages - currentPage < 4 && totalPages - i <= 4) || 
            totalElements === totalPages
        ) {
            array.push(i)
        } else if (array[array.length - 1] !== "...") {
            array.push("...")
        }
    }
    return array
}

const Grid = ({ children }: GridProps) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 10
    const totalElements = 7

    const changeToPrevPage = () => {
        setCurrentPage(prevPage => {
            if (prevPage === 6) {
                return prevPage - 2
            }
            return prevPage - 1
        })
    }

    const changeToNextPage = () => {
        setCurrentPage(prevPage => {
            if (prevPage === 4) {
                return prevPage + 2
            }
            return prevPage + 1
        })
    }



    let paginationArray = getPages(currentPage, totalElements, totalPages)
    // for (let i = 0; i < totalPages; i++) {
    // } 
    return (
        <div className='gird'>
            <div className='grid__list'>
                {children}
            </div>
            <div className="grid__controls">
                <nav className="grid__pagination pagination">
                    <ul className="pagination__list">

                        {
                            paginationArray.map((item, index) => {
                                if (item !== "...") {
                                    return (
                                    <li key={index} className="pagination__item">
                                        <button className={`pagination__button ${currentPage === item ? "pagination__button--active" : ""}`} onClick={() => setCurrentPage(item)} type="button"><span>{item}</span></button>
                                    </li>
                                    )
                                }
                                return (
                                    <li key={index} className="pagination__item">
                                        <button className="pagination__button pagination__button--ellipsis" type="button"><span>{item}</span></button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
                <div className='grid__buttons'>
                    { currentPage !== 1 && (
                        <button className='grid__button grid__button--prev button button--black' type='button' onClick={changeToPrevPage}>
                            <img src={buttonArrow} alt="" />
                            <span>Предыдущие</span>
                        </button>
                    )}
                    { currentPage !== totalPages && (
                        <button className='grid__button grid__button--next button button--black' type='button' onClick={changeToNextPage}>
                            <span>Показать ещё</span>
                            <img src={buttonArrow} alt="" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Grid