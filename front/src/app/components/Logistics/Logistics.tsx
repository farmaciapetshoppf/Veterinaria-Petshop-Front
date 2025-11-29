import CardLogistics from '../CardLogistics/CardLogistics'
import img1 from "@/src/assets/truck.png"
import img2 from "@/src/assets/delivery.png"
import img3 from "@/src/assets/local.png"

function Logistics() {

  const items = [
    { img: img1, text: "Envio rápido" },
    { img: img2, text: "Entrega por correo" },
    { img: img3, text: "Retiro en sucursal" }
  ]

  return (
    <div className='flex flex-wrap justify-center
      sm:flex-row sm:justify-between sm:me-3 sm:ms-3 no-scrollbar
      lg:mt-20'>

      {items.map((item, index) => (
        <CardLogistics
          key={index}
          img={item.img}
          text={item.text}
        />
      ))}

    </div >
  )
}

export default Logistics
