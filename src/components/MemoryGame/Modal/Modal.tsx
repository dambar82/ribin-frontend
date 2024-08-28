import React,  {FC} from 'react';
import './Modal.css';

interface Props {
    title: string,
    description: string
    modalShow: boolean,
    isOver: boolean,
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Modal: FC<Props> = ({ title, description, modalShow, onClick}) => {

    return (
        <React.Fragment>
            <div className={`modal ${modalShow ? 'modal--open' : ''}`}>
                <div className="modal__title">{ title }</div>
                <div className="modal__description">{ description }</div>
                <button className="modal__btn" onClick={onClick} type='button'>сыграть еще</button>
            </div>
        </React.Fragment>
    )
}