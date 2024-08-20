import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react'
import { classNames } from '../../utils'

import c from './input.module.scss'

type IInputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(( { className, ...props }: IInputProps, ref: ForwardedRef<HTMLInputElement> ) => {
	return (
		<input
			className={classNames(className, c.input )}
			{...props}
			ref={ref}
		/>
	)
})
