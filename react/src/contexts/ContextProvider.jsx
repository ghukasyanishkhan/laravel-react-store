import {createContext, useContext, useState} from "react";

const StateContext = createContext({
    user: null,
    token: null,
    message: null,
    items: [],
    users: null,
    userItems: null,
    searchedItems: null,
    setUserItems: () => {
    },
    setSearchedItems: () => {
    },
    setUsers: () => {
    },
    setItems: () => {
    },
    setMessage: () => {
    },
    setUser: () => {
    },
    setToken: () => {
    },
})


export const ContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [message, _setMessage] = useState(null)
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState(null);
    const [userItems, setUserItems] = useState(null);
    const [searchedItems, setSearchedItems] = useState(null);

    const setMessage = (message) => {
        _setMessage(message);
        setTimeout(() => {
            _setMessage(null)
        }, 5000)
    }

    const setToken = (token) => {
        if (token) {
            _setToken(token);
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            _setToken(null);
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            items,
            setItems,
            setUser,
            setToken,
            message,
            setMessage,
            users,
            setUsers,
            userItems,
            setUserItems,
            searchedItems,
            setSearchedItems,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
