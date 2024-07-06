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
        // <div className="page">
        //     <section className="section">
        //         <div className="section__header">
        //             <h1 className="section__title">Активисты</h1>
        //         </div>
        //         <div className="section__body">
        //             <div style={{
        //                 display: "flex", 
        //                 flexWrap: "wrap",
        //                 gap: "20px"
        //             }}>
        //                 { students.map(student => (
        //                     <PersonCard key={student.id} name={student.title} imageUrl={student.imagePreviewResized}/>
        //                 ))}
        //             </div>
        //         </div>
        //     </section>
        // </div>
    )
}

export default CoachesPage