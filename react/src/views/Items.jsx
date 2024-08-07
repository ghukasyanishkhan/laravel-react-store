import { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import "../css/Items.css";
import { Link } from "react-router-dom";

export default function Items() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user, setUser, items, setItems, searchedItems } = useStateContext();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const fileRef = useRef();
    const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

    const onStore = (evt) => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append('file', fileRef.current.files[0]);
        formData.append('name', nameRef.current.value);
        formData.append('description', descriptionRef.current.value);

        axiosClient.post('/item', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                fetchItems();
                setIsFormVisible(false);
            })
            .catch((err) => {
                setErrors(err.response?.data?.errors || {});
                console.log(err);
            });
    };

    const fetchItems = () => {
        setIsLoading(true);
        axiosClient.get('/items')
            .then(({ data }) => {
                setItems(data.items);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
                console.log('finaly')
            });
    };

    const fetchUser = () => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data.user);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getItemLink = () => {
        return user ? '/home/item' : '/item';
    }

    useEffect(() => {
        if (items?.length === 0) {
            fetchItems();
        }
        if (user === null) {
            fetchUser();
        }
    }, []);

    const itemsToDisplay = searchedItems?.length > 0 ? searchedItems : items;
    const noResults = searchedItems && searchedItems.length === 0;

    return (
        <div className="items-container">
            <div className='item-header'>
                <h1>Items</h1>
                {user && (
                    <button
                        onClick={() => setIsFormVisible(!isFormVisible)}
                        className={`add-item ${isFormVisible ? 'hidden' : ''}`}
                    >
                        Add Item
                    </button>
                )}
            </div>
            {isFormVisible && (
                <div className='add-item-form-overlay'>
                    <div className='add-item-form'>
                        <form onSubmit={onStore}>
                            <span>Add Photo</span>
                            <input
                                ref={fileRef}
                                type='file'
                                name='file'
                                className="file-input"
                            />
                            {errors?.file && <p className='field-error'>{errors.file}</p>}
                            <input
                                ref={nameRef}
                                placeholder='Name'
                                type='text'
                                name='name'
                                className="name-input"
                            />
                            {errors?.name && <p className='field-error'>{errors.name}</p>}
                            <textarea
                                ref={descriptionRef}
                                name='description'
                                placeholder='Description'
                                className="description-input"
                            ></textarea>
                            {errors?.description && <p className='field-error'>{errors.description}</p>}
                            <button type='submit' className="submit-button">Submit</button>
                            <button className='cancel-button' onClick={() => setIsFormVisible(!isFormVisible)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            {isLoading ? (
                <p className="loading-text">Loading...</p>
            ) : noResults ? (
                <p className="no-results-text">No results found</p>
            ) : (
                <div className='items-grid'>
                    {itemsToDisplay.map((item) => (
                        <div key={item.id} className='item-card'>
                            <Link
                                to={getItemLink()}
                                state={{ item, isUpdate: false }}
                            >
                                <img
                                    src={item.image_path ? `${IMG_BASE_URL}/${item.image_path}` : 'default-image-url'}
                                    alt={item.name}
                                    className='item-image'
                                />
                            </Link>
                            <div className='item-details'>
                                <h3 className='item-name'><b>Name:</b> {item.name}</h3>
                                <p className='item-description'><b>Description:</b> {item.description}</p>
                                <p className='item-views'>Views: {item.views}</p>
                            </div>
                            <div><b>Owner: </b>{item.user.name}</div>
                            <div><b>Email: </b>{item.user.email}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
