import React, {FC}  from "react";
import './Counter.css'

interface Props {
    text: string;
    value: number;
}

export const Counter: FC<Props> = ({text, value}) => {
    return (
        <div className="counter">
            <div className="counter__text">
                {text}
            </div>
            <div className="counter__value">
                {value}
            </div>
        </div>
    )
}