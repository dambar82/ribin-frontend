import React from 'react';
import rubyLogo from '../../../images/rubyLogo.svg';
import {Link} from "react-router-dom";


const RestoreHeader = () => {
    return (
        <div className='justify_content_Center header_restore'>
            <Link to='/'>
                <img src={rubyLogo} alt=""/>
            </Link>
        </div>
    );
};

export default RestoreHeader;