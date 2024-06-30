"use client"
import Link from "next/link";
import Image from "next/image";
import {FaStar, FaStarHalf} from "react-icons/fa";

import {Tabs, TabsTrigger, TabsList} from './ui/tabs'
import {useEffect, useState} from "react";

export type DataType = {
    id: number,
    attributes: {
        title: string
        description: string
        capacity: number
        type: string
        image: {
            data: {
                attributes: {
                    name: string
                    url: string
                }
            }
        }
        price: number
        size: string
    }
}

type RoomsType = {
    data: DataType[]
}

type Props = {
    rooms: RoomsType
}


const RoomList = ({rooms}: Props) => {
    const [roomType, setRoomType] = useState('all')
    const [filteredRooms, setFilteredRooms] = useState<Array<DataType>>([])

    useEffect(() => {
        const filtered: DataType[] = rooms.data.filter(room => {
            return (
                roomType === 'all' ? rooms
                    :
                    roomType === room.attributes.type
            )
        })
        setFilteredRooms(filtered)
    }, [roomType]);

    const handleClickAll = () => {
        setRoomType('all')
    }
    const handleClickSingle = () => {
        setRoomType('single')
    }
    const handleClickDouble = () => {
        setRoomType('double')
    }
    const handleClickExtended = () => {
        setRoomType('extended')
    }

    return (
        <section className='py-16 min-h-[90vh]'>
            <div className='flex flex-col items-center'>
                <div className='relative w-[130px] h-[40px]'>
                    <Image src={'/assets/head.svg'} alt={''} fill className='object-cover'/>
                </div>
                <h3 className='h2 mb-8'>Our Rooms</h3>
            </div>

            <Tabs defaultValue={'all'} className='w-[240px] lg:w-[540px] h-[200px] lg:h-auto mb-8 mx-auto'>
                <TabsList className='w-full h-full lg:h-[46px] flex flex-col lg:flex-row'>
                    <TabsTrigger value={'all'} className='w-full h-full' onClick={handleClickAll}>All</TabsTrigger>
                    <TabsTrigger value={'single'} className='w-full h-full'
                                 onClick={handleClickSingle}>Single</TabsTrigger>
                    <TabsTrigger value={'double'} className='w-full h-full'
                                 onClick={handleClickDouble}>Double</TabsTrigger>
                    <TabsTrigger value={'extended'} className='w-full h-full'
                                 onClick={handleClickExtended}>Extended</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredRooms.map(el => {
                    const imgURL = el.attributes.image.data.attributes.url
                    console.log(imgURL)
                    return (
                        <div key={el.id}>
                            <Link href={`/room/${el.id}`}>
                                <div className='relative w-full h-[300px] overflow-hidden mb-6'>
                                    <Image src={imgURL} fill priority alt='' className='object-cover'/>
                                </div>
                            </Link>
                            <div className='h-[135px] '>
                                <div className='flex items-center justify-between mb-6'>
                                    <div>Capacity - {el.attributes.capacity} person</div>
                                    <div className="flex gap-1 text-accent">
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStarHalf/>
                                    </div>
                                </div>
                                <Link href={`/room/${el.id}`}>
                                    <h3 className='h3'>
                                        {el.attributes.title}
                                    </h3>
                                </Link>
                                <p className='h3 font-secondary font-medium text-accent mb-4'>
                                    ${el.attributes.price}
                                    <span className='text-base  text-secondary'>/ night</span>
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

    );
};

export default RoomList;