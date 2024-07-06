import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import PersonsPageTemplate from '../../components/PersonsPageTemplate/PersonsPageTemplate';

import { fetchCoaches } from '../../store/coachesSlice';

const CoachesPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { coaches, status, error } = useSelector((state: RootState) => state.coaches);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoaches());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <PersonsPageTemplate
            title="Тренеры клуба"
            persons={coaches}
        />
    )
}

export default CoachesPage