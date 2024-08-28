import { Card } from './types'
import imgNginx from './images/Ак Барс Арена.jpg'
import imgFirebase from './images/Академия_И_База_Футбольного_Клуба_Рубин.jpg'
import imgJs from './images/Баскет_Холл.jpg'
import imgReact from './images/дворец единоборств ак барс.jpg'
import imgRedux from './images/Дворец_Водных_Видов_Спорта.jpg'
import imgTs from './images/Казанская_Академия_Тенниса.jpg'
import imgWebpack from './images/Татнефть_Арена.jpg'
import imgWs from './images/Казань_Ринг_(Авто_гоночная_Трасса).jpg'

export function getNoun(number: number, one: string, two: string, five: string) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}

export function getInitialCards(): Card[] {
    const cardData = [
        { img: imgNginx, name: 'nginx' },
        { img: imgFirebase, name: 'firebase' },
        { img: imgJs, name: 'js' },
        { img: imgReact, name: 'react' },
        { img: imgRedux, name: 'redux' },
        { img: imgTs, name: 'ts' },
        { img: imgWebpack, name: 'webpack' },
        { img: imgWs, name: 'ws' }
    ];

    const firstSetCards = cardData.map((item, i) => ({
        id: i + 1,
        img: item.img,
        open: false,
        found: false,
        isSolved: false,
        name: item.name
    }));

    const secondSetCards = firstSetCards.map((item) => ({ ...item, id: item.id + firstSetCards.length }));

    const allCards = [...firstSetCards, ...secondSetCards];
    const shuffledCards = shuffleArray(allCards);

    return shuffledCards;
}

function shuffleArray(array: any[]): any[] {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}