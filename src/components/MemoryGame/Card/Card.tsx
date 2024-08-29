import React,  {FC} from 'react';
import './Card.css';
import img from '../images/c.svg'

interface Props {
    id: number,
    isOpen: boolean,
    isSolved: boolean,
    imgSrc: string
    name: string
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Card: FC<Props> = ({ id, isOpen, isSolved, imgSrc, name, onClick }) => {

    return (
        <React.Fragment>
            <div className={`card ${isOpen ? 'card--open' : ''} ${isSolved ? 'card--solved' : ''}`} onClick={onClick}>
                <div className="card__container">
                    <div className="card__front">
                        <img src={img} alt="Закрытая карточка" />
                    </div>
                    <div className="card__inner">
                        <img src={imgSrc} alt="Открытая карточка" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}