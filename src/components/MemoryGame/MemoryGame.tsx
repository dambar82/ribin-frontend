import React, { useState, useEffect } from 'react';
import './App.css';
import { Card } from './Card/Card';
import { Counter } from './Counter/Counter';
import { Modal } from './Modal/Modal';
import { getNoun, getInitialCards } from './utils';

interface Card {
    id: number,
    isOpen: boolean,
    isSolved: boolean,
    img: string
    name: string
}

interface MemoryGameProps {
    numberOfAttempts?: number;
    titleText?: string;
    winMessage?: string;
    loseMessage?: string;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
                                                          numberOfAttempts = 40,
                                                          titleText = 'MEMORY',
                                                          winMessage = 'Ура, ВЫ выиграли!',
                                                          loseMessage = 'УВЫ, ВЫ ПРОИГРАЛИ'
                                                      }) => {
    const [step, setStep] = useState(0);
    const [cards, setCards] = useState<Card[]>([]);
    const [openCardsTimeout, setOpenCardsTimeout] = useState<NodeJS.Timeout | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [areCardsClickable, setAreCardsClickable] = useState(true);

    useEffect(() => {
        // Инициализация игры при монтировании компонента
        resetGame();
    }, []);

    useEffect(() => {
        if (cards.length > 0) {
            checkGameState();
        }
    }, [cards, step]);

    const resetGame = () => {
        setStep(0);
        setCards(getInitialCards()); // Начальные карты
        setModalShow(false);
        setTitle('');
        setDescription('');
        setAreCardsClickable(true);
    };

    const handleCardClick = (id) => {
        if (!areCardsClickable) return;

        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, isOpen: true } : card
        );

        setCards(updatedCards);

        const openCards = updatedCards.filter((card) => card.isOpen && !card.isSolved);

        if (openCards.length === 2) {
            setStep((prevStep) => prevStep + 1);

            if (openCards[0].name === openCards[1].name) {
                const solvedCards = updatedCards.map((card) =>
                    card.isOpen ? { ...card, isSolved: true } : card
                );
                setCards(solvedCards);
            } else {
                setAreCardsClickable(false);
                setTimeout(() => {
                    const closedCards = updatedCards.map((card) =>
                        card.isOpen && !card.isSolved ? { ...card, isOpen: false } : card
                    );
                    setCards(closedCards);
                    setAreCardsClickable(true);
                }, 1500);
            }
        }
    };

    const checkGameState = () => {
        const remainingAttempts = numberOfAttempts - step;

        if (step >= numberOfAttempts) {
            setTitle(loseMessage);
            setDescription('К сожалению, у вас закончились попытки.');
            setModalShow(true);
            setAreCardsClickable(false);
        } else if (remainingAttempts > 0 && cards.every((card) => card.isSolved)) {
            setTitle(winMessage);
            setDescription(`Это заняло ${step} ${getNoun(step, 'ход', 'хода', 'ходов')}.`);
            setModalShow(true);
            setAreCardsClickable(false);
        }
    };

    return (
        <div className="memory-game">
            {/*<h1>{titleText}</h1>*/}
            <div className="memory">
                <Counter text="Осталось попыток" value={numberOfAttempts - step} />
                <Counter text="Сделано ходов" value={step} />
                <div className="memory__cards">
                    {cards.map((item) => (
                        <Card
                            id={item.id}
                            key={item.id}
                            isOpen={item.isOpen}
                            isSolved={item.isSolved}
                            imgSrc={item.img}
                            name={item.name}
                            onClick={() => handleCardClick(item.id)}
                        />
                    ))}
                </div>
                <Modal
                    title={title}
                    description={description}
                    modalShow={modalShow}
                    isOver={step >= numberOfAttempts}
                    onClick={resetGame}
                />
            </div>
        </div>
    );
};
