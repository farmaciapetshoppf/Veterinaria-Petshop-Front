import Carousel from '../app/components/Carousel/Carousel'
import HomeCategories from '../app/components/HomeCategories/HomeCategories'
import Delivery from '../app/components/Delivery/Delivery'

export default function Home() {
  return (
    <div className='pt-20 bg-orange-200'>

      <Carousel />

      {/* TODO: texto rosa si quieren lo cambiamos */}
      <p className=' flex justify-center bg-pink-300 text-black font-bold p-6 w-full'>
        Gestiona turnos, segui el calendario de vacunacion y además distrutá de nuestra tienda
      </p>

      <HomeCategories />

      <Delivery />

    </div>
  );
}
