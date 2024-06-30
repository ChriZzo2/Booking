import {
    Alert,
    AlertTitle
} from "@/components/ui/alert";
import {FaInfoCircle} from "react-icons/fa";
import {MessageErrorType} from "@/components/Reservation";





const MessageError = ({message, type}: MessageErrorType) => {
    return (
        <Alert className={`rounded-none ${type === 'error' ? 'bg-red-400 text-white' : 'bg-green-400 text-white'}`}>


            <div className='flex items-center gap-2'>
                <div className='text-xl w-[44px] h-[44px] flex justify-center items-center'>
                    <FaInfoCircle/>
                </div>
                <AlertTitle className='text-white flex-1 font-secondary text-base leading-snug'>
                    {message}
                </AlertTitle>
            </div>
        </Alert>
    );
};

export default MessageError;