import React from 'react';
import rubyLogo from '../../../images/rubyLogo.svg';
import { useLocation, Link } from 'react-router-dom';

const UnauthHeader = () => {
    const location = useLocation();

    return (
        <div className={`justify_content_SB header_unauth`}>
            <Link to='/'>
                <img src={rubyLogo} alt=""/>
            </Link>
            <Link to={location.pathname === '/login' ? '/register' : '/login'}>
                <div className='bordered_button_white'>
                    {location.pathname === '/login' ? 'У меня ещё нет аккаунта' : 'У меня уже есть аккаунт'}
                </div>
            </Link>
        </div>
    );
};

export default UnauthHeader;