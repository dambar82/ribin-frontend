import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import c from './checkbox.module.scss'

type CheckboxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,HTMLInputElement>

const Checkbox = (props: CheckboxProps) => {
	return (
		<div className={c.checkbox}>

			<input
				type="checkbox"
				{...props}
			/>

			<label htmlFor={props.id} >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" ><path d="M1 9.4L6.71429 15L21 1" stroke="#DED500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </label>

		</div>
	)
}

export { Checkbox }