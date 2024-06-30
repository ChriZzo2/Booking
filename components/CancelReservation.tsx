"use client"

import {AttributesType} from "@/components/Reservation";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTrigger, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import axios from "axios";

type Props = {
    reservation: AttributesType
}

const deleteData = async (id: number) => {
    try {
        const res = await axios.delete(`http://127.0.0.1:1337/api/reservations/${id}`)
        return res.data
    } catch (error){
        console.log(error)
    }
}

const CancelReservation = ({reservation}: Props) => {
    const router = useRouter()
    const cancelReservation = (id: number) => {

       return  (
           deleteData(id),
           router.refresh()
       )
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size='sm'>Cancel Reservation</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => cancelReservation(reservation.id)}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CancelReservation;