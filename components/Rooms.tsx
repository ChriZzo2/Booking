import RoomList from "@/components/RoomList";
import axios from "axios";

const getRooms = async () => {
    try {
        const res = await axios.get(`https://wealthy-broccoli-070ad62d8a.strapiapp.com/api/rooms?populate=*`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reservation data:', error);
        throw error;
    }
}

const Rooms = async () => {
    const rooms = await getRooms()
    console.log(rooms)
    return (
        <section>
            <div className="container mx-auto">
                <RoomList rooms={rooms}/>
            </div>
        </section>
    );
};

export default Rooms;