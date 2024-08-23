import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import PersonsPageTemplate from '../../components/PersonsPageTemplate/PersonsPageTemplate';

import { fetchCoaches } from '../../store/coachesSlice';
import axios from "axios";

const CoachesPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { status, error } = useSelector((state: RootState) => state.coaches);
    const [coachesWithDetails, setCoachesWithDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Сначала получаем всех тренеров
                const response = await axios.get('https://api-rubin.multfilm.tatar/api/request/academy-coaches');
                const coaches = response.data;

                // Далее получаем подробности по каждому тренеру
                const detailedCoaches = await Promise.all(coaches.map(async (coach) => {
                    const details = await axios.get(`https://api-rubin.multfilm.tatar/api/request/academy-coaches/${coach.id}`);
                    return { ...coach, details: details.data };
                }));

                setCoachesWithDetails(detailedCoaches);
            } catch (error) {
                console.error('Ошибка при загрузке данных тренеров:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    if (coachesWithDetails.length === 0) {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <PersonsPageTemplate
            title="Тренеры клуба"
            type="coaches"
            persons={coachesWithDetails}
        />
    )
}

export default CoachesPage