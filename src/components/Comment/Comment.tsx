import styles from "./Comment.module.scss"

import DropdownMenu from "../DropdownMenu/DropdownMenu"
import likeIcon from '../../images/svg/likes.svg'
import {Client} from "../../types";
import {postFormatDate} from "../../App";
import {useEffect, useState} from "react";
import {useAppDispatch} from "../../store/hooks";
import {commentLikeAsync} from "../../store/postSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import likeIconLiked from "../../images/svg/likes_red.svg";
import {User} from "../../store/userSlice";
import {fetchPeople} from "../../store/peopleSlice";

interface IComment {
    id: number;
    liked_by: number[];
    text: string;
    created_at: string;
    likes_count: number;
    name: string;
    created_by: number;
    avatar: string | null;
}

const Comment = ({ id, liked_by, text, created_at, likes_count, name, avatar, created_by }: IComment) => {

    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [likes, setLikes] = useState(likes_count);
    const [isLiked, setIsLiked] = useState(liked_by.includes(user.user.id));

    const handleLikeClick = () => {
        if (!isLiked) {
            dispatch(commentLikeAsync({commentId: id}))
            setLikes(likes + 1);
            setIsLiked(true);
        }
    }

    return (
        <div className={styles.comment}>
            <div className={styles.comment__header}>
                <div className={`${styles.comment__author} ${styles.author}`}>
                    <div className={styles.author__avatar}>
                        <img src={avatar} alt="" />
                    </div>
                    <div className={styles.author__name}>{name}</div>
                    <div className={styles.author__date}>{postFormatDate(created_at)}</div>
                </div>
                <DropdownMenu />
            </div>
            <div className={styles.comment__body}>
                <p>{text}</p>
            </div>
            <div className={styles.comment__footer}>
                <div className={styles.comment__likes} onClick={handleLikeClick}>
                    <div className={styles.comment__likesIcon}>
                        <img
                            src={isLiked ? likeIconLiked : likeIcon}
                            alt=""
                        />
                    </div>
                    <span className={`${styles.comment__label} ${isLiked ? styles.comment__label_liked : ''}`}>{likes}</span>
                </div>
                <button className={`${styles.comment__button} ${styles.comment__button_reply}`} type="button">Ответить</button>
                <button className={`${styles.comment__button} ${styles.comment__button_share}`} type="button">Поделиться</button>
            </div>
        </div>
    )
}

export default Comment
