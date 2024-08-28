import { forwardRef, ForwardedRef, TextareaHTMLAttributes } from 'react'
import { classNames } from '../../utils'

import c from './input.module.scss'

type ITextareaProps = {
   label?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef(( { label, className, ...props }: ITextareaProps, ref: ForwardedRef<HTMLTextAreaElement> ) => {
  return (
    <textarea
      className={classNames(className, c.input)}
      {...props}
      ref={ref}
    />
  )
})
