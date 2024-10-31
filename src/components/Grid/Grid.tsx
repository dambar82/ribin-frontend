import React, {useEffect, useState} from "react"

import buttonArrow from "../../images/svg/button_arrow.svg";

interface GridProps {
    children: React.ReactNode;
    totalItems: number;
    itemsPerPage?: number;
    threeCols?: boolean;
}

// const ITEMS_PER_PAGE = 6;

const getPages = (currentPage, totalPages) => {
    const delta = 2; // Количество страниц вокруг текущей страницы
    let array = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            array.push(i);
        } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
            array.push('...');
        }
    }

    return array;
}

const Grid = ({ children, totalItems, itemsPerPage = 6, threeCols }: GridProps) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        console.log(totalItems + "/" + itemsPerPage + "=", totalPages)
    }, [totalPages])

    const changePage = (newPage) => {
        setCurrentPage(newPage);
    };

    let paginationArray = getPages(currentPage, totalPages);

    const childrenArray = React.Children.toArray(children);

    return (
        <div className='grid'>
            <div className='grid__list'
                 style={{ gridTemplateColumns: threeCols ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr' }}>
                {childrenArray.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            </div>
            { totalPages > 1 && (
                <div className="grid__controls">
                    <nav className="grid__pagination pagination">
                        <ul className="pagination__list">

                            {
                                paginationArray.map((item, index) => {
                                    if (item !== "...") {
                                        return (
                                        <li key={index} className={`pagination__item ${item === '...' ? 'pagination__item--ellipsis' : ''}`}>
                                            <button className={`pagination__button ${currentPage === item ? "pagination__button--active" : ""}`} onClick={() => item !== '...' && changePage(item)} type="button"><span>{item}</span></button>
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
                    <div className='grid__buttons' style={{marginLeft: 'auto'}}>
                        { currentPage > 1 && (
                            <button className='grid__button grid__button--prev button button--black' type='button' onClick={() => changePage(currentPage - 1)}>
                                <img src={buttonArrow} alt="" />
                                <span>Предыдущие</span>
                            </button>
                        )}
                        { currentPage !== totalPages && (
                            <button className='grid__button grid__button--next button button--black' type='button' onClick={() => changePage(currentPage + 1)}>
                                <span>Показать ещё</span>
                                <img src={buttonArrow} alt="" />
                            </button>
                        )}
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default Grid