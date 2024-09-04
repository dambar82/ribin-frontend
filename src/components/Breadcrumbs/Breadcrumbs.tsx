import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';
import { classNames } from '../../shared/utils'

interface BreadcrumbsProps {
  currentPageName?: string
}
const Breadcrumbs = ({ currentPageName }: BreadcrumbsProps) => {
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
                        <>
                            <span>|</span>
                            <li key={to} className={classNames('breadcrumb-item', styles.active)} aria-current="page">
                                {currentPageName || breadcrumbNameMap[value] || value}
                            </li>
                        </>
                    ) : (
                        <>
                            <span>|</span>
                            <li key={to} className="breadcrumb-item">
                                <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
                            </li>
                        </>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
