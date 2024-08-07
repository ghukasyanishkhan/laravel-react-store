import {useRef, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import '../css/Search.css';

export default function Search() {
    const textRef = useRef();
    const [text, setText] = useState("");
    const {items, setItems, searchedItems, setSearchedItems} = useStateContext();

    const onChange = (evt) => {
        setText(evt.target.value);
    };

    const onClick = () => {

        if (text === '') {
            setSearchedItems(null);
        } else {
            const result = items.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setSearchedItems(result.length === 0 ? [] : result);
        }
    };

    return (
        <div className="search-container">
            <input
                onChange={onChange}
                ref={textRef}
                type='text'
                value={text}
                placeholder='Find items'
                className="search-input"
            />
            <button onClick={onClick} className="search-button">
           ok
            </button>
        </div>
    );
}
