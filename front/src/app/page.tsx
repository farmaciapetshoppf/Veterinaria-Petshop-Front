import Carousel from '../app/components/Carousel/Carousel'
import HomeCategories from '../app/components/HomeCategories/HomeCategories'
import Delivery from '../app/components/Delivery/Delivery'

export default function Home() {
  return (
    <div >

      <Carousel />

      <p className=' flex justify-center bg-pink-300 text-white font-bold p-6 w-full'>
        Gestiona turnos, segui el calendario de vacunacion y además distrutá de nuestra tienda
      </p>

      <HomeCategories />

      <Delivery />

    </div>
  );
}
