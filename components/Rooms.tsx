import RoomList from "@/components/RoomList";
import axios from "axios";

const getRooms = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:1337/api/rooms?populate=*`);
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