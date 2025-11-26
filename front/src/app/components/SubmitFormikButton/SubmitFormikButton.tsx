import React from 'react'

/* TODO: add styles */
function SubmitFormikButton({text="confirm", disabled=false}) {
  return (
    <button
        type='submit'
        disabled={disabled}

    > 
    {text}
    </button>
  )
}

export default SubmitFormikButton
