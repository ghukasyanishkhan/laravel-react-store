import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import GuestHeader from "../components/GuestHeader.jsx";


export default function Guest() {
    const {token} = useStateContext();

    if (token) {
        return <Navigate to='/home'/>;
    }

    return (
        <div>
            <GuestHeader/>
            <Outlet/>
        </div>
    );
}
