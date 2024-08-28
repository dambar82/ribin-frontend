import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import PersonsPageTemplate from '../../components/PersonsPageTemplate/PersonsPageTemplate';

import { fetchStudents } from '../../store/studentsSlice';
import axios from "axios";

const StudentsPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { status, error } = useSelector((state: RootState) => state.students);
    const [studentsWithDetails, setStudentsWithDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Сначала получаем всех тренеров
                const response = await axios.get('https://api-rubin.multfilm.tatar/api/request/students');
                const students = response.data;

                // Далее получаем подробности по каждому тренеру
                const detailedStudents = await Promise.all(students.map(async (student) => {
                    const details = await axios.get(`https://api-rubin.multfilm.tatar/api/request/students/${student.id}`);
                    return { ...student, details: details.data };
                }));

                setStudentsWithDetails(detailedStudents);
            } catch (error) {
                console.error('Ошибка при загрузке данных тренеров:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <PersonsPageTemplate
            title="Активисты"
            type="students"
            persons={studentsWithDetails}
        />
    )
}

export default StudentsPage