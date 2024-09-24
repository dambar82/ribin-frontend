import styles from "./Comment.module.scss"

import DropdownMenu from "../DropdownMenu/DropdownMenu"
import likeIcon from '../../images/svg/likes.svg'
import {Client} from "../../types";
import {postFormatDate} from "../../App";
import {useEffect, useState} from "react";
import {useAppDispatch} from "../../store/hooks";
import {commentLikeAsync, deleteCommentAsync, editPostAsync} from "../../store/postSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import likeIconLiked from "../../images/svg/likes_red.svg";
import {User} from "../../store/userSlice";
import {fetchPeople} from "../../store/peopleSlice";
import {Link} from "react-router-dom";
import {Button} from "../../shared/UI";
import axios from "axios";

interface IComment {
    id: number;
    liked_by: number[];
    text: string;
    created_at: string;
    likes_count: number;
    name: string;
    created_by: number;
    avatar: string | null;
    deleteComment: (number) => void;
}

const Comment = ({ id, liked_by, text, created_at, likes_count, name, avatar, created_by, deleteComment }: IComment) => {

    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [likes, setLikes] = useState(likes_count);
    const [isLiked, setIsLiked] = useState(liked_by.includes(user.user.id));
    const [isAuthor, setIsAuthor] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(text);
    const [incorrectWords, setIncorrectWords] = useState(false);

    const makeLinksClickable = (text) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlPattern);

        return parts.map((part, index) => {
            if (urlPattern.test(part)) {
                return (
                    <a key={index} href={part} style={{color: '#91172C'}} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const renderTextWithParagraphs = (text) => {
        return text.split('\n').map((paragraph, index) => (
            <p key={index}>
                {makeLinksClickable(paragraph)}
            </p>
        ));
    };

    const handleLikeClick = () => {
        if (!isLiked) {
            dispatch(commentLikeAsync({commentId: id}))
            setLikes(likes + 1);
            setIsLiked(true);
        }
    }

    const handleDeleteClick = () => {
        deleteComment(id)
        dispatch(deleteCommentAsync({commentId: id}))
    }

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleEditComment = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.append('description', commentText);
        formData.set('_method', 'put');

        //const editComment = await axios.post(editPostAsync({postId: id, formData}));

        setIsEditing(false);
    }

    const goToProfile = () => {
        window.location.href = `/user/${created_by}`;
    }

    useEffect(() => {
        if (user.user.id === created_by) {
            setIsAuthor(true);
        }
    }, [])

    return (
        <div className={styles.comment}>
            <div className={styles.comment__header}>
                <div className={`${styles.comment__author} ${styles.author}`} onClick={() => goToProfile()}>
                    <div className={styles.author__avatar}>
                        <img src={avatar} alt="" />
                    </div>
                    <div className={styles.author__name}>{name}</div>
                    <div className={styles.author__date}>{postFormatDate(created_at)}</div>
                </div>
                <DropdownMenu
                  isAuthor={isAuthor}
                  comment={{ id, created_by, name }}
                  deleteClick={handleDeleteClick}
                  editClick={handleEditClick}
                />
            </div>
            <div className={styles.comment__body}>
                {
                    isEditing ? (
                            <form className={styles.post__commentsForm} onSubmit={handleEditComment}>
                                <div className={styles.textarea_wrapper} >
                                    <textarea
                                        name="editPost"
                                        id=""
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                    {
                                        incorrectWords && (
                                            <div className={`${styles.symbols_message} ${incorrectWords ? styles.show : ''}`}>
                                                Вы используете недопустимые слова. Измените текст и повторите попытку.
                                            </div>
                                        )
                                    }
                                    <Button className={styles.submit_button}>Сохранить</Button>
                                </div>
                            </form>
                        ) : renderTextWithParagraphs(commentText)
                }
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
                {/* <button className={`${styles.comment__button} ${styles.comment__button_reply}`} type="button">Ответить</button>
                <button className={`${styles.comment__button} ${styles.comment__button_share}`} type="button">Поделиться</button> */}
            </div>
        </div>
    )
}

export default Comment
