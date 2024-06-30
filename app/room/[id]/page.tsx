import {DataType} from "@/components/RoomList";
import Image from "next/image";
import {TbArrowsMaximize, TbUsers} from "react-icons/tb";
import Reservation from "@/components/Reservation";
import axios from "axios";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export type roomType = {
    data: DataType
}

const getRoomData = async ({ params }) => {
    try {
        const res = await axios.get(`http://127.0.0.1:1337/api/rooms/${params.id}?populate=*`);
        return res.data;
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
};

const getReservationData = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:1337/api/reservations?populate=*` );
        return res.data;
    } catch (error) {
        console.error('Error fetching reservation data:', error);
        throw error;
    }
};

const RoomDetails = async ({params}: { params: any }) => {
    const room: roomType = await getRoomData({params})
    const reservations = await getReservationData()
    const {isAuthenticated, getUser} = getKindeServerSession()
    const isUserAuthenticated = await isAuthenticated()
    const userData =  await getUser()


    const imgURL = `http://127.0.0.1:1337${room.data.attributes.image.data.attributes.url}`
    console.log(imgURL)
    return (
        <section className='min-h-[80vh]'>
            <div className="container mx-auto py-8">
                <div className='flex flex-col lg:flex-row lg:gap-12 h-full'>
                    <div className='flex-1 '>
                        <div className='relative h-[360px] lg:h-[420px] mb-8'>
                            <Image src={imgURL} alt={''} fill className='object-cover'/>
                        </div>
                        <div className='flex flex-1 flex-col mb-8'>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='h3 '>{room.data.attributes.title}</h3>
                                <p className='h3 font-secondary font-medium text-accent'>${room.data.attributes.price}
                                    <span className='text-base text-secondary'>/ night</span>
                                </p>
                            </div>
                            <div className='flex items-center gap-8 mb-4'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-2xl text-accent'>
                                        <TbArrowsMaximize/>
                                    </div>
                                    <p>
                                        {room.data.attributes.size} m<sup>2</sup>
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-2xl text-accent'>
                                        <TbUsers/>
                                    </div>
                                    <p>
                                        {room.data.attributes.capacity}
                                    </p>
                                </div>

                            </div>
                            <p >{room.data.attributes.description}</p>


                        </div>

                    </div>
                    <div className='w-full lg:max-w-[360px] h-max'>
                        <Reservation
                            reservations={reservations}
                            room={room}
                            isUserAuthenticated={isUserAuthenticated}
                            userData={userData}

                        />
                    </div>

                </div>


            </div>
        </section>
    );
};

export default RoomDetails;