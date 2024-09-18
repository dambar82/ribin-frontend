import { useState } from "react"
import c from "./accordion.module.scss"
import { classNames } from "../../utils"

interface AccordionProps {
  accordion: { title: string, body: React.ReactNode }[]
  className?: string
}
const Accordion = ({ accordion, className }: AccordionProps) => {
  const [checked, setChecked] = useState(null);

  return (
    <ul className={classNames(c.accordion, className)}>
      {accordion.map((elem, i) => (
        <li key={i}>
          <p>{elem.title}</p>
          <input
            type="radio"
            name="elem"
            checked={checked === i}
            onChange={() => {}}
            onClick={() =>
              setChecked((prev) => {
                if (prev === i) {
                  return null;
                }
                return i;
              })
            }
          />
          <div>
            {elem.body}
          </div>
          <i></i>
        </li>
      ))}
    </ul>
  );
};

export { Accordion };
