import PersonCard from "../PersonCard/PersonCard"

const PersonsPageTemplate = ({ title, persons }) => {
    // const students = ['Рамиз', 'Рамиз', 'Рамиз','Рамиз', 'Рамиз','Рамиз','Рамиз','Рамиз','Рамиз','Рамиз','Рамиз']
    return (
        <div className="page">
            <section className="section persons">
                <div className="section__header">
                    <div className="section__title">{title}</div>
                </div>
                <div className="section__body">
                    <div className="persons__grid">
                        {persons.map(person => (
                            <PersonCard key={person.id} name={person.title} imageUrl={person.imagePreviewResized} />
                        ))}
                        {/* {students.map((name, index) => (
                            <PersonCard key={name + index} name={name} imageUrl="" />
                        ))} */}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PersonsPageTemplate