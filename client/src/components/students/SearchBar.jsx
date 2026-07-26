import React, {useState}from 'react'
import {assets} from "../../assets/assets"
import { useNavigate} from 'react-router-dom';
const SearchBar = ({data=""}) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate(`/course-list/${input}`);
  };
  return (
      <form className = "max-w-full w-2xl md:h-14 h-12 flex item-center bg-white border border-gray-500/20 rounded" onSubmit={onSearchHandler}>
        <img src={assets.search_icon} alt="search" className= "md:w-auto w-10 px-3"/>
        <input type="text" placeholder="Search for courses" className="w-full h-full outline-none text-grey-500/80" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>
  )
}

export default SearchBar