import {useLocation, useNavigate} from 'react-router-dom';
import '../css/Item.css';
import {useEffect, useRef, useState} from 'react';
import axiosClient from '../axios-client.js';
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Item() {
    const {state} = useLocation();
    const {item, isUpdate} = state || {};
    const [views, setViews] = useState(item ? item.views : 0);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageRef = useRef(null); // Ref for file input
    const navigate = useNavigate();
    const {setMessage, setItems} = useStateContext();
    const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

    if (!item) {
        return <div>No item found</div>;
    }

    const fetchItems = () => {
        axiosClient.get('/items')
            .then(({data}) => {
                setItems(data.items);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteItem = () => {
        let isDelete = window.confirm('Do you want to delete item?');
        if (isDelete) {
            axiosClient.delete(`/item/${item.id}`)
                .then((response) => {
                    console.log(response);
                    fetchItems();
                    setMessage(response.data.message);
                    navigate('/home');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const updateItem = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', nameRef.current.value);
        formData.append('description', descriptionRef.current.value);

        if (imageRef.current.files.length > 0) {
            formData.append('image', imageRef.current.files[0]);
        }

        axiosClient.post(`/item/${item.id}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log(response);
                setMessage(response.data.message);
                navigate('/home');
            })
            .catch((error) => {
                console.error('Failed to update item:', error);
            });
    };

    useEffect(() => {
        axiosClient.post(`/increment/${item.id}`)
            .then((response) => {
                setViews(prevViews => prevViews + 1);
            })
            .catch((error) => {
                console.error('Failed to increment views:', error);
            });
    }, [item.id]);

    return (
        <div>

            {isUpdate && <div className='item-header'>
                <h1>Item Details</h1>
                <button onClick={deleteItem} className='delete-item'>Delete</button>
            </div>}


            <div className="item-detail-container">
                <div className="item-detail-header">
                    <h1>Name: {item.name}</h1>
                </div>
                <div className="item-detail-content">
                    <img
                        src={item.image_path ? `${IMG_BASE_URL}/${item.image_path}` : 'default-image-url'}
                        alt={item.name}
                        className='item-image'
                    />
                    <div className="item-detail-info">
                        <p><b>Description:</b> {item.description}</p>
                        <b>Views:</b> <p>{views}</p>
                    </div>
                </div>
            </div>

            {isUpdate && (
                <div className="update-form-container">
                    <h2>Update Item</h2>
                    <form onSubmit={updateItem}>
                        <label>
                            Name:
                            <input
                                type="text"
                                defaultValue={item.name}
                                ref={nameRef}
                                required
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                defaultValue={item.description}
                                ref={descriptionRef}
                                required
                            />
                        </label>
                        <label>
                            Image:
                            <input
                                type="file"
                                ref={imageRef}
                            />
                        </label>
                        <button type="submit">Update Item</button>
                    </form>
                </div>
            )}
        </div>
    );
}
