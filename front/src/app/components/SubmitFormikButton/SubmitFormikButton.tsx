function SubmitFormikButton({text="confirm", disabled=false}) {
  return (
    <button
        type='submit'
        disabled={disabled}
        className={`border-2 m-3 p-3 rounded
        bg-orange-400 font-bold text-2xl mt-7
        cursor-pointer hover:bg-orange-500
        hover:text-black
        w-52 flex self-center justify-center

        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
    > 
    {text}
    </button>
  )
}

export default SubmitFormikButton
