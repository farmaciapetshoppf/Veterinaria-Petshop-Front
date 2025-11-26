import { ErrorMessage, Field } from 'formik';
import React from 'react'

interface FieldCustomProps {
  label: string;
  nameField: string;
  type: string;
  placeholder?: string;
}
/* TODO: add styles */
const FieldFormikCustom: React.FC<FieldCustomProps> = ({ label, nameField, type, placeholder }) => {
  return (
    <div>
      <label>{label}</label>
      <Field
        name={nameField}
        type={type}
        placeholder={placeholder}
      />

      <ErrorMessage
        className='text-red-600'
        name={nameField}
        component="div"
      ></ErrorMessage>
    </div>
  )
}

export default FieldFormikCustom
