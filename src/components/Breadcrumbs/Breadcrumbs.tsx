import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbNameMap: Record<string, string> = {
        '': 'Главная',
        'club-activities': 'Активности клуба',
        'events': 'Мероприятия',
        'training': 'Тренировка',
        'event': 'Тренировка'
    };

    return (
        <nav aria-label="breadcrumb" className={styles.breadcrumb}>
            <ol className={styles.breadcrumbs}>
                <li className="breadcrumb-item">
                    <Link to="/">Главная</Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return isLast ? (
                        <React.Fragment>
                            <span>|</span>
                            <li key={to} className="breadcrumb-item active" aria-current="page">
                                {breadcrumbNameMap[value] || value}
                            </li>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <span>|</span>
                            <li key={to} className="breadcrumb-item">
                                <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
