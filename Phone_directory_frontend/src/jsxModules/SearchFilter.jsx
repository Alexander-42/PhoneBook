const SearchFilter = ({text, newFilter, handleFilterChange}) => {
    return (
        <div>
            {text} 
            <input 
            value = {newFilter}
            onChange = {handleFilterChange}
            />
        </div>
    )
}

export default SearchFilter