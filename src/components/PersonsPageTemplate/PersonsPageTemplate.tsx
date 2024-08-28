import PersonCard from "../PersonCard/PersonCard"
import {useEffect} from "react";

const PersonsPageTemplate = ({ title, type, persons }) => {

    return (
      <div className="page">
        <section className="section persons">
            <div className="section__header">
                <div className="section__title">{title}</div>
            </div>
            <div className="section__body">
                <div className="persons__grid">
                    {persons.map(person => (
                        <PersonCard key={person.id} name={person.title} id={person.id} type={type} details={person.details} imageUrl={person.imagePreviewResized} />
                    ))}
                </div>
            </div>
        </section>
      </div>
    )
}

export default PersonsPageTemplate