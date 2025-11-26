function SubmitFormikButton({text="confirm", disabled=false}) {
  return (
    <button
        type='submit'
        disabled={disabled}
        className='border-2 m-3 p-3 
        bg-green-800 font-bold text-2xl mt-7
        cursor-pointer hover:bg-green-700
        w-52 flex self-center justify-center
        '
    > 
    {text}
    </button>
  )
}

export default SubmitFormikButton
