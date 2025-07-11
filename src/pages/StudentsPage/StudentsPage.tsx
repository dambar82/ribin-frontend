import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import PersonsPageTemplate from '../../components/PersonsPageTemplate/PersonsPageTemplate';

import { fetchStudents } from '../../store/studentsSlice';
import axios from "axios";
import {fetchCoaches} from "../../store/coachesSlice";

const StudentsPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { students, status, error } = useSelector((state: RootState) => state.students);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStudents());
        }
    }, [status, dispatch]);

    if (status === 'failed') {
        return <p>{error}</p>;
    }

    return (
        <PersonsPageTemplate
            title="Активисты"
            type="students"
            persons={students}
        />
    )
}

export default StudentsPage