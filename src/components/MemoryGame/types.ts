export interface CardsList {
    items: Card[];
}

export interface Card {
    id: number,
    isOpen: boolean,
    isSolved: boolean,
    img: string
    name: string
}