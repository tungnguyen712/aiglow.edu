import PropTypes from "prop-types";

import { Input } from "@/components/commons";
import { SearchIcon, CancelIcon } from "@/assets/icons";
import {useRef} from "react";

const SearchForm = ({ query, setQuery }) => {
    const searchRef = useRef();

    const handleClearValue = () => {
        if (query) {
            setQuery("");
            searchRef.current.focus();
        }
    }

    return (
        <Input
            ref={searchRef}
            placeholder="Search Here..."
            className="block w-full px-5 py-3.5 text-gray-500 rounded-xl outline-none border-dashed focus:border-gray-500 hover:border-gray-500 dark:focus:border-white placeholder:font-normal transition-all duration-300"
            icon={query ? <CancelIcon size={18}/> : <SearchIcon/>}
            iconPosition="right"
            iconClick={handleClearValue}
            name="search"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
            }}
        />
    )
}

SearchForm.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired
}

export default SearchForm;