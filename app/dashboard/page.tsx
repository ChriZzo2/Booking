import {Button} from "@/components/ui/button";
import Link from "next/link";
import {format} from "date-fns";
import axios from "axios";


const getUserReservation = async (email: any) => {
    try {
        const res = await axios.get(`https://wealthy-broccoli-070ad62d8a.strapiapp.com/api/reservations?[filters][email][$eq]=${email}&populate=*`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reservation data:', error);
        throw error;
    }

}

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {AttributesType} from "@/components/Reservation";
import CancelReservation from "@/components/CancelReservation";

const Dashboard = async () => {

    const {getUser} = getKindeServerSession()

    const user = await getUser()
    const userReservation = await getUserReservation(user?.email)
    console.log(userReservation)
    return (
        <section className='min-h-[80vh]'>
            <div className="container mx-auto py-8 h-full">
                <h3 className='h3 font-bold mb-12 border-b pb-4 text-center lg:text-left'>
                    My booking
                </h3>
                <div className='flex flex-col  gap-8  h-full'>
                    {userReservation.data.length < 1 ?
                        <div className='flex flex-col items-center justify-center  h-[50vh]'>
                            <p className='text-xl text-center text-secondary/70 mb-4'>Dear guest, you currently have no booking. Book now for guaranteed comfort!</p>
                            <Link href="/">
                                <Button size='md'>Go to homepage</Button>
                            </Link>
                        </div>
                        :
                        userReservation.data.map((item: AttributesType) => {
                            console.log(item)
                            return (
                                <div
                                    key={item.id}
                                    className='bg-tertiary py-8 px-12'

                                >
                                    <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
                                        <h3 className='text-2xl font-medium w-[200px] text-center lg:text-left'>{item.attributes.room.data.attributes.title}</h3>
                                        <div className='flex flex-col lg:flex-row gap-2 lg:w-[380px]'>
                                            <div className='flex items-center gap-1 flex-1'>
                                            <span className='text-accent font-bold uppercase tracking-[1.2px]'>
                                                from:
                                            </span>
                                                <span className='text-secondary font-semibold'>
                                                {format(item.attributes.checkin, 'PPP')}
                                            </span>
                                            </div>
                                            <div className='flex items-center gap-1 flex-1'>
                                            <span className='text-accent font-bold uppercase tracking-[1.2px]'>
                                                to:
                                            </span>
                                                <span className='text-secondary font-semibold'>
                                                {format(item.attributes.checkOut, 'PPP')}
                                            </span>
                                            </div>
                                        </div>
                                        <div>
                                            <CancelReservation reservation={item}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </section>

    );
};

export default Dashboard;