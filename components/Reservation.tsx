"use client"
import {useEffect, useState} from "react";

import {format, isPast} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils"


import {UserType} from "@/components/DropDown";
import {roomType} from "@/app/room/[id]/page";
import {LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import MessageError from "@/components/MessageError";
import axios from "axios";
import {DataType} from "@/components/RoomList";
import {useRouter} from "next/navigation";


type RoomType = {
    data: DataType
}
export type AttributesType = {
    id: number
    attributes:
        {
            firstname: string,
            lastname: string,
            email: string,
            checkin: string,
            checkOut: string
            room: RoomType
        }
}
type Props = {
    reservations: {
        data: AttributesType[]
    }
    userData: UserType | null
    isUserAuthenticated: boolean
    room: roomType
}
export type MessageErrorType = {
    message: string
    type: 'error' | 'success' | null
}


const postData = async (url: string, data: object) => {
    const settings = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(url, data, settings)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

const Reservation = ({reservations, userData, isUserAuthenticated, room}: Props) => {
    const [checkInDate, setCheckInData] = useState<Date>()
    const [checkOutDate, setCheckOutData] = useState<Date>()
    const [message, setMessage] = useState<MessageErrorType | null>(null)
    const router = useRouter()


    const formatDateForDB = (date: Date) => {
        return format(date, 'yyyy-MM-dd')
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage(null)
        }, 3000)

        return () => clearTimeout(timer)
    }, [message]);

    const saveReservation = () => {
        if (!checkInDate || !checkOutDate) {
            return setMessage({
                message: 'Please select check-in and check-out dates',
                type: 'error'
            })
        }
        if (checkInDate?.getTime() === checkOutDate?.getTime()) {
            return setMessage({
                message: 'Check-in and check-out dates cannot be the same. Please select different dates for check-in and check-out.',
                type: 'error'
            })
        }

        const isReservations = reservations.data.filter(item => {
            return (
                item.attributes.room.data.id === room.data.id
            )
        }).some(item => {
            const existingCheckIn = new Date(item.attributes.checkin).setHours(0, 0, 0, 0)
            const existingCheckOut = new Date(item.attributes.checkOut).setHours(0, 0, 0, 0)

            const checkInTime = checkInDate?.setHours(0, 0, 0, 0)
            const checkOutTime = checkOutDate?.setHours(0, 0, 0, 0)

            const isReservationBetweenDates = (checkInTime >= existingCheckIn && checkInTime < existingCheckOut) ||
                (checkOutTime > existingCheckIn && checkOutTime <= existingCheckOut) || (existingCheckIn > checkInTime && existingCheckIn < checkOutTime)
                || (existingCheckOut > checkInTime && existingCheckOut <= checkOutTime)
            return isReservationBetweenDates
        })

        if (isReservations) {
            setMessage({
                message: "Sorry, but the selected dates are not available for booking. Please choose different check-in and check-out dates to proceed with your reservation.",
                type: 'error'
            })
        } else {
            const data = {
                data: {
                    firstname: userData?.given_name,
                    lastname: userData?.family_name,
                    email: userData?.email,
                    checkin: checkInDate ? formatDateForDB(checkInDate) : null,
                    checkOut: checkOutDate ? formatDateForDB(checkOutDate) : null,
                    room: room.data.id
                }
            }

            postData('http://127.0.0.1:1337/api/reservations', data)
            setMessage({
                message: "Your booking for the selected dates has been successfully confirmed. We are looking forward to hosting you and ensuring a comfortable stay.",
                type: 'success'
            })
            router.refresh()
        }


    }

    return (
        <div>
            <div className='bg-tertiary h-[320px] mb-4'>
                <div className='bg-accent py-4 text-center relative mb-2'>
                    <h4 className='text-xl text-white'>
                        Book your room
                    </h4>
                    <div className='absolute -bottom-[8px] left-[calc(50%)] w-0 h-0
                    border-l-[10px] border-l-transparent border-t-[8px] border-t-accent
                    border-r-[10px] border-r-transparent'>

                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full py-6 px-8'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant='default'
                                size='md'
                                className={cn(
                                    "w-full flex justify-start text-left font-semibold",
                                    !checkInDate && "text-secondary"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {checkInDate ? format(checkInDate, "PPP") : <span>Check in</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={setCheckInData}
                                initialFocus
                                disabled={isPast}

                            />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant='default'
                                size='md'
                                className={cn(
                                    "w-full flex justify-start text-left font-semibold",
                                    !checkInDate && "text-secondary"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {checkOutDate ? format(checkOutDate, "PPP") : <span>Check out</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={checkOutDate}
                                onSelect={setCheckOutData}
                                initialFocus
                                disabled={isPast}

                            />
                        </PopoverContent>
                    </Popover>
                    {isUserAuthenticated ? (
                        <Button onClick={() => saveReservation()} size='md'>Book now</Button>
                    ) : (
                        <LoginLink>
                            <Button className='w-full' size='md'>
                                Book now
                            </Button>
                        </LoginLink>
                    )}
                </div>
            </div>

            {message && <MessageError message={message.message} type={message.type}/>}
        </div>
    );
};

export default Reservation;