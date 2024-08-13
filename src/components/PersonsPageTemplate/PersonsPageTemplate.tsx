import PersonCard from "../PersonCard/PersonCard"

const PersonsPageTemplate = ({ title, persons }) => {

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
                </div>
            </div>
        </section>
      </div>
    )
}

export default PersonsPageTemplate