import { useState } from "react"
import { classNames } from "../../../shared/utils"
import { FILTERS, TFilter } from "../constants"
import { TFilters } from "../PhotoGalleryPage"

import filter from "../../../images/svg/filter.svg"

import c from "../PhotoGalleryPage.module.scss";



interface FilterProps {
  filters: TFilters
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>
}
export const Filter = ({ filters, setFilters }: FilterProps) => {

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSelect, setActiveSelect] = useState<TFilter[number]['id']|null>(null)

  const clickSelectHandler = ( filterId: string ) => {
    setActiveSelect(prev => {
      if ( prev === filterId ) {
        return null
      }
      if ( prev ) {
        return filterId
      }
      return filterId
    })
  }

  const chooseFilter = ( filterId: string, element: { key: number | string, value: string } ) => {
    setFilters(prev => {
      prev[filterId] = element
      return {...prev}
    })
  }

  return (
    <div className={`${c.photogallery__filter} ${dropdownOpen ? "filter filter--open" : "filter"}`} style={{ marginLeft: "auto" }}>
        <button className='filter__button' type="button" onClick={() => setDropdownOpen(prevState => !prevState)}>
            <img src={filter} alt=''/>
        </button>
        <div className='filter__menu'>
            <ul className='filter__menu-list'>

              {FILTERS.map(filter => (
                <li key={filter.id} className={classNames('filter__menu-item', activeSelect === filter.id ? c._active : '')} >
                  <div
                    className={c.filter_item_title}
                    onClick={() => clickSelectHandler(filter.id)}
                  >
                    <span>{filters?.[filter.id].value}</span>
                    <span className='filter__menu-arrow'>
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                  </div>
                  <div className={c.filter_select} >
                    {filter.elements.map(element => (
                      <div key={element.key} onClick={() => chooseFilter(filter.id, element)} >
                        {element.value}
                      </div>
                    ))}
                  </div>
              </li>
              ))}

            </ul>
        </div>
    </div>
  )
}