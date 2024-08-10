import { ButtonHTMLAttributes, ForwardedRef, ReactNode, forwardRef } from "react"
import { classNames } from "../../utils"

import c from './button.module.scss'

type TButtonProps = ButtonHTMLAttributes<HTMLElement>

type ButtonProps = {
   children: ReactNode
} & TButtonProps

const Button = forwardRef(({ children, className, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <button className={classNames(c.button, className)} {...props} ref={ref} >
      {children}
    </button>
  )
})

export { Button }