import { ReactNode, useEffect, useRef } from 'react'
import { classNames } from '../../utils'

import c from './modal.module.scss'
import { createPortal } from 'react-dom'

interface ModalProps {
  children: ReactNode
  className?: string
  bodyClassName?: string
  portal?: true
  active: boolean | null
  setActive: React.Dispatch<React.SetStateAction<boolean | null>>
}
const Modal = ({ children, className, bodyClassName, portal, active, setActive }: ModalProps) => {

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

  const modal = (
    <div className={classNames(c.modal, className)} ref={modalRef} >
      <div className={classNames(c.modal_body, 'block', bodyClassName)} >

        <button type="button" className={c.close} onClick={closeModal} ></button>

        {children}

      </div>
    </div>
  )

  if ( portal ) {
    return createPortal(modal, document.body)
  }

  return modal
}

export { Modal }