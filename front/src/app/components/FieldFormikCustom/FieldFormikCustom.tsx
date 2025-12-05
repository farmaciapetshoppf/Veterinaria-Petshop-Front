import { ErrorMessage, Field } from 'formik';
import React from 'react'

interface FieldCustomProps {
  label: string;
  nameField: string;
  type: string;
  placeholder?: string;
}

const FieldFormikCustom: React.FC<FieldCustomProps> = ({ label, nameField, type, placeholder }) => {
  return (
    <div className='flex flex-col items-center mx-3 text-black'>

      {/* Placeholder e Imput */}
      <div className='flex md:flex-row flex-col md:w-full mb-1 mt-2  '>
        <label className='font-bold mr-3 flex self-start'>{label}</label>

        <Field
          className="border-2 rounded-2xl p-2 w-60 bg-white"
          name={nameField}
          type={type}
          placeholder={placeholder}
        />

      </div>

      {/* Error */}
      <ErrorMessage
        className='text-red-600'
        name={nameField}
        component="div"
      ></ErrorMessage>
    </div>
  )
}

export default FieldFormikCustom
