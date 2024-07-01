import { useState } from "react"

import buttonArrow from "../../images/svg/button_arrow.svg";
import NewsCard from "../NewsCard/NewsCard";

interface GridProps {
    elements: any[];
}

const Grid = ({elements}: GridProps) => {
    const [currentPage, setCurrentPage] = useState(0)
    const totalPage = 10

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
    return (
        <div className='gird'>
            <div className='grid__list'>
                {elements.map((item) => (
                    <NewsCard key={item.id} {...item} />
                ))}
            </div>
            <div className="grid__controls">
                <nav className="grid__pagination pagination">
                    <ul className="pagination__list">
                        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                            if (item < 6)
                                return (
                                    <li key={item + index} className="pagination__item">
                                        <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} onClick={() => setCurrentPage(index)} type="button"><span>{item}</span></button>
                                    </li>
                                )
                            if (item === 6) {
                                return (
                                    <li key={item + index} className="pagination__item">
                                        <button className="pagination__button pagination__button--ellipsis" type="button"><span>...</span></button>
                                    </li>
                                )
                            }
                            return (
                                <li key={item + index} className="pagination__item">
                                    <button className={`pagination__button ${currentPage === index ? "pagination__button--active" : ""}`} type="button" onClick={() => setCurrentPage(index)}><span>10</span></button>
                                </li>
                            )

                        })}
                    </ul>
                </nav>
                <div className='grid__buttons'>
                    { currentPage !== 0 && (
                        <button className='grid__button grid__button--prev button button--black' type='button' onClick={changeToPrevPage}>
                            <img src={buttonArrow} alt="" />
                            <span>Предыдущие</span>
                        </button>
                    )}
                    { currentPage !== totalPage - 4 && (
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

export default Grid;
