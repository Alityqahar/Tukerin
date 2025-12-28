import Calender from "../Calender/Calender";
import Notif from "../Notif/Notif";

interface SideContentLeftProps {
    userId: string;
}

export default function SideContentLeft({ userId }: SideContentLeftProps) {
    return (
        <>
            <Calender />
            <Notif userId={userId} />
        </>
    );
}