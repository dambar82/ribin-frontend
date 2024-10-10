import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import './Chat.scss';
import Notification from './Notification';
import EmojiPicker from 'emoji-picker-react'; // Убедитесь, что библиотека установлена
import { useParams } from 'react-router-dom';
import loupe from '../../images/svg/loupe.svg';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Button} from "../../shared/UI/button/Button";
import { classNames } from '../../shared/utils'

const pusher = new Pusher('05817bdeb548cb607678', {
    cluster: 'mt1',
});


function formatDateTime(dateTimeString) {
    // Массив с названиями месяцев на русском языке
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    console.log(dateTimeString);

    // Разделяем строку на даты и время
    const [date] = dateTimeString.split(' ');

    // Получаем компоненты даты
    const [year, month, day] = date.split('-');

    // Получаем наименование месяца из массива
    const monthName = months[parseInt(month) - 1]; // month - 1, чтобы получить корректный индекс

    // Собираем и возвращаем результат в нужном формате
    return `${day} ${monthName} ${dateTimeString.split(' ')[1].slice(0, 5)}`;
}

let token;

try {
    const storedToken = localStorage.getItem('token');
    token = JSON.parse(storedToken);

    // Проверка, если токена нет, просто присваиваем его значение null
    if (storedToken === null) {
        token = null; // Токен отсутствует
    }
} catch (error) {
    console.error('Ошибка при получении токена:', error);
}


const Chat = () => {
    const { userId } = useParams(); // Получение userId из параметров URL
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0, messageId: null });
    const [isSending, setIsSending] = useState(false); // Состояние для отслеживания отправки сообщения
    const messagesEndRef = useRef(null);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('https://api-rubin.multfilm.tatar/api/messages/contacts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setContacts(response.data.data.map(contact => ({ ...contact, unreadCount: 0 })));
            } catch (error) {
                console.error('Ошибка при получении списка контактов:', error);
            }
        };
        fetchContacts();
    }, [userId]); // добавление userId в зависимости

    useEffect(() => {
        const channelName = `chat.${userId}`;
        const channel = pusher.subscribe(channelName);

        channel.bind('message-sent', (data) => {
            if (data.message.to_client_id === userId) {
                setNotification({
                    sender: contacts.find(contact => contact.id === data.client.id)?.name || 'Новый контакт',
                    message: data.message.message.slice(0, 50),
                });
                setMessages(prevMessages => [...prevMessages, data.message]);
                if (data.message.from_client_id !== selectedContact?.id) {
                    setContacts(prevContacts =>
                        prevContacts.map(contact =>
                            contact.id === data.message.from_client_id
                                ? { ...contact, unreadCount: contact.unreadCount + 1 }
                                : contact
                        )
                    );
                } else {

                }
                scrollToBottom(); // Прокрутка вниз при поступлении нового сообщения
            }
        });
        channel.bind('update-messages', ()=>{
            fetchMessages()
        })
        return () => {
            channel.unbind('message-sent');
            pusher.unsubscribe(channelName);
        };
    }, [userId, selectedContact]);
    const fetchMessages = async () => {
        if (selectedContact) {
            try {
                const response = await axios.get(`https://api-rubin.multfilm.tatar/api/messages/get/${selectedContact.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMessages(response.data.data || []);
                scrollToBottom(); // Прокрутка вниз при открытии чата
            } catch (error) {
                console.error('Ошибка при получении сообщений:', error);
            }
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
            scrollToMessagesList();
        }
    }, [messages]);

    useEffect(() => {
        fetchMessages();
    }, [selectedContact]);

    // useEffect(() => {
    //     console.log(contacts);
    // }, [contacts])

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            setIsSending(true); // Устанавливаем состояние отправки сообщения
            try {
                const answer = await axios.post(`https://api-rubin.multfilm.tatar/api/messages/send/${selectedContact.id}`, { message: newMessage }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMessages(prevMessages => [...prevMessages, answer.data.data]);
                setNewMessage('');
                setIsTyping(false);
                scrollToBottom(); // Прокрутка вниз после отправки сообщения
                scrollToMessagesList();
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            } finally {
                setIsSending(false); // Сбрасываем состояние отправки сообщения
            }
        }
    };

    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
        setMessages([]);
    };

    const filteredMessages = messages?.filter((msg) => {
        return msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    });


    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleEmojiPicker = () => {
        setShowEmoji(prevState => !prevState);
    };

    const onEmojiClick = (event) => {
        setChosenEmoji(event);
        setNewMessage(prevMessage => prevMessage + event.emoji);
    };

    const deleteMessage = async (messageId) => {
        try {
            await axios.delete(`https://api-rubin.multfilm.tatar/api/messages/delete-message/${messageId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
            setContextMenu({ isVisible: false });
        } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
        }
    };

    const editMessage = async (messageId, newContent) => {
        try {
            await axios.put(`https://api-rubin.multfilm.tatar/api/messages/edit-message/${messageId}`, { message: newContent }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(prevMessages => prevMessages.map(msg => msg.id === messageId ? { ...msg, message: newContent } : msg));
            setContextMenu({ isVisible: false });
        } catch (error) {
            console.error('Ошибка при изменении сообщения:', error);
        }
    };

    const handleContextMenu = (e, messageId) => {
        e.preventDefault();
        setContextMenu({
            isVisible: true,
            x: e.pageX,
            y: e.pageY,
            messageId: messageId,
        });
    };

    const handleEdit = () => {
        const messageToEdit = messages.find(msg => msg.id === contextMenu.messageId);
        const newContent = prompt('Введите новое сообщение:', messageToEdit.message);
        if (newContent) {
            editMessage(contextMenu.messageId, newContent);
        }
    };

    const handleDelete = () => {
        deleteMessage(contextMenu.messageId);
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ isVisible: false });
    };

    const scrollToBottom = () => {
        const messagesList = document.querySelector('.messages-list');
        if (messagesList) {
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    };

    const scrollToMessagesList = () => {
        const messagesList = document.querySelector('.messages-list');
        if (messagesList) {
            messagesList.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="chat-app" onClick={handleCloseContextMenu}>
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                {/*<button className="toggle-btn" onClick={toggleSidebar}>*/}
                {/*    {isSidebarCollapsed ? '➡️' : '⬅️'}*/}
                {/*</button>*/}
                <div className='search-bar_wrapper'>
                    <h2>Ваши чаты</h2>
                    <div className="search-bar">
                        <img src={loupe} alt=""/>
                        <input
                            style={isSidebarCollapsed ? { display: 'none' } : {}}
                            type="text"
                            placeholder="Поиск по сообщениям"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="contacts-list">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                            onClick={() => handleContactSelect(contact)}
                        >
                            <img src={contact.client.avatar} width={60} height={60} style={{ border: 'none', borderRadius: '50%' }} />
                            <div className={'contact-item_content'}>
                                <span>{contact.client.name} {contact.client.surname}</span>
                                {contact.message ? <span>{contact.message}</span> : <span></span>}
                            </div>
                            {/*<span className={`status ${contact.online ? 'online' : 'offline'}`}>{isSidebarCollapsed ? '' : (contact.online ? 'Online' : 'Offline')}</span>*/}
                            {contact.unreadCount > 0 && (
                                <span className="unread-count">{contact.unreadCount}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={classNames('chat-window', selectedContact ? '_active' : '')}>
                {selectedContact ? (
                    <>
                        <button
                          type='button'
                          className='back_button'
                          onClick={() => setSelectedContact(null)}
                        >
                          Назад
                        </button>
                        <div className="messages-list">
                            {filteredMessages?.map((msg, index) =>
                                msg.from_client_id.toString() === userId ? (
                                    <div className='message-item' style={{justifyContent: 'flex-end'}} key={index}>
                                        <div className='message-content_wrapper'>
                                            <div
                                                className="message-content"
                                                style={{backgroundColor: '#FFDDE3', borderRadius: '25px 25px 0px 25px'}}
                                                onContextMenu={(e) => handleContextMenu(e, msg.id)}
                                            >
                                                <div className="message-text">
                                                    <span>{msg.message}</span>
                                                </div>
                                            </div>
                                            {
                                                msg.created_at && (
                                                    <span className='message-date'>{msg.created_at}</span>
                                                )
                                            }
                                        </div>
                                        <div className='messenger-avatar'
                                            style={{top: '50px'}}
                                        >
                                            <img src={msg.from_client_id.toString() === userId ? user.avatar : selectedContact.client.avatar} alt=""/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='message-item' style={{justifyContent: 'flex-start'}} key={index}>
                                        <div className='messenger-avatar'
                                             style={{top: '50px'}}
                                        >
                                            <img src={msg.from_client_id.toString() === userId ? user.avatar : selectedContact.client.avatar} alt=""/>
                                        </div>
                                        <div className='message-content_wrapper'>
                                            <div
                                                className="message-content"
                                                style={{backgroundColor: '#FBFBFB', borderRadius: '25px 25px 25px 0px'}}
                                                onContextMenu={(e) => handleContextMenu(e, msg.id)}
                                            >
                                                <div className="message-text">
                                                    <span>{msg.message}</span>
                                                </div>
                                            </div>
                                            {
                                                msg.created_at && (
                                                    <span className='message-date'>{msg.created_at}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="message-input" style={{ position: 'relative' }}>
                            <div>
                              <input
                                  type="text"
                                  value={newMessage}
                                  onChange={(e) => {
                                      setNewMessage(e.target.value);
                                      setIsTyping(true);
                                  }}
                                  placeholder="Введите сообщение..."
                              />
                              <span onClick={toggleEmojiPicker} >
                                  😄
                              </span>
                            </div>
                            {showEmoji && (
                                <div className="emoji-picker">
                                    <EmojiPicker onEmojiClick={onEmojiClick} skinTonesDisabled={false} searchDisabled={true} />
                                    <button style={{ color: '#676767' }} onClick={toggleEmojiPicker}>Отмена</button>
                                </div>
                            )}
                            {isSending ? (
                                <Button>Загрузка...</Button> // Лоадер, который отображается во время отправки сообщения
                            ) : (
                                <Button onClick={sendMessage}>
                                  <span>Отправить</span>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.71256 3.05048C3.62262 3.00657 3.52154 2.99079 3.4225 3.00517C3.32345 3.01956 3.23104 3.06346 3.15732 3.13114C3.08359 3.19883 3.03196 3.28715 3.00918 3.38461C2.98639 3.48206 2.99349 3.58412 3.02956 3.67748L5.87256 11.3045C6.04023 11.7547 6.04023 12.2502 5.87256 12.7005L3.03056 20.3275C2.99467 20.4207 2.98766 20.5226 3.01044 20.6199C3.03322 20.7172 3.08473 20.8053 3.15828 20.873C3.23183 20.9406 3.32402 20.9845 3.42287 20.9991C3.52172 21.0136 3.62265 20.9981 3.71256 20.9545L21.7126 12.4545C21.7982 12.414 21.8705 12.35 21.9212 12.27C21.9719 12.19 21.9988 12.0972 21.9988 12.0025C21.9988 11.9078 21.9719 11.815 21.9212 11.735C21.8705 11.655 21.7982 11.591 21.7126 11.5505L3.71256 3.05048Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12H22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-contact-selected">
                        <div className="no-contact_text">
                            <h1>Упсс, пусто!</h1>
                            <h2>Найдите новых друзей и начните переписку!</h2>
                        </div>
                        <div className="no-contact_image">
                            <img src="/images/e5bf71101e031debc774a9229c0e9f62.png" alt=""/>
                        </div>
                    </div>
                )}
            </div>
            {notification && (
                <Notification
                    sender={notification.sender}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            {contextMenu.isVisible && (
                <div
                    className="context-menu"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        borderRadius: '5px'
                    }}
                >
                    <button onClick={handleEdit}>Изменить</button>
                    <button onClick={handleDelete}>Удалить</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
