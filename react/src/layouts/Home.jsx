import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import Message from "../components/Message.jsx";

export default function Home() {
    const { user, token,message } = useStateContext();

    if (!token) {
        return <Navigate to='/items' />;
    }

    return (
        <div>
            <HomeHeader/>
            {message && <Message message={message}/>}
            <Outlet />
        </div>
    );
}
