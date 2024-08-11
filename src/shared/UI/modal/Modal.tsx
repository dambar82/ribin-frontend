import { ReactNode, useEffect, useRef } from 'react'
import { classNames } from '../../utils'

import c from './modal.module.scss'

interface ModalProps {
  children: ReactNode
  className?: string
  bodyClassName?: string
  active: boolean | null
  setActive: React.Dispatch<React.SetStateAction<boolean | null>>
}
const Modal = ({ children, className, bodyClassName, active, setActive }: ModalProps) => {

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if ( active === false ) {
      closeModal()
    }

    if ( active ) {
      const body = document.querySelector('body')
      if ( body ) {
        body.style.overflow = 'hidden'
        body.addEventListener('keydown', clickEsc)
      }
    }

  }, [active])

  const clickEsc = ( e: globalThis.KeyboardEvent ) => {
    if ( e?.key === 'Escape' ) {
      const body = document.querySelector('body')
      if ( body ) body.removeEventListener('keydown', clickEsc)
      closeModal()
    }
  }

  const closeModal = () => {
    modalRef.current?.classList.add('_hide')
    setTimeout(() => {
      setActive(null)
      const body = document.querySelector('body')
      if ( body ) {
        //@ts-ignore
        body.style.overflow = null
        body.removeEventListener('keydown', clickEsc)
      }
    }, 300)
  }

  if ( !active ) {
    return <></>
  } 

  return (
    <div className={classNames(c.modal, className)} ref={modalRef} >
      <div className={classNames(c.modal_body, 'block', bodyClassName)} >

        <button className={c.close} onClick={closeModal} ></button>

        {children}

      </div>
    </div>
  )
}

export { Modal }