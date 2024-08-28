import React from "react"
import styles from "./Row.module.scss"

interface IRow {
    children: React.ReactNode;
}

const Row = ({children}: IRow) => {
    return (
        <div className={styles.row}>
            {children}
        </div>
    )
}

export default Row