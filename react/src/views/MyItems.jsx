import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import "../css/Items.css";
import {Link} from "react-router-dom";

export default function MyItems() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {user, setUser, userItems, setUserItems} = useStateContext();
    const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

    const fetchUser = () => {
        setIsLoading(true);
        axiosClient.get('/user')
            .then(({data}) => {
                setUser(data.user);
                setUserItems(data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors(error);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (user === null || userItems===null) {
            fetchUser();
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (errors) {
        return <div>Error: {errors.message}</div>;
    }

    return (
        <div className="items-container">
            <div className='item-header'>
                <h1>Items</h1>
            </div>
            <div className='items-grid'>
                {userItems?.map((item) => (
                    <div key={item?.id} className='item-card'>
                        <Link
                            to={`/home/item`}
                            state={{item,isUpdate: true}}
                            key={item.id}
                        >
                            <img
                                src={item.image_path ? `${IMG_BASE_URL}/${item.image_path}` : 'default-image-url'}
                                alt={item.name}
                                className='item-image'
                            />
                        </Link>
                        <div className='item-details'>
                            <h3 className='item-name'><b>Name:</b> {item?.name}</h3>
                            <p className='item-description'><b>Description:</b> {item?.description}</p>
                            <p className='item-views'>Views: {item?.views}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
}
