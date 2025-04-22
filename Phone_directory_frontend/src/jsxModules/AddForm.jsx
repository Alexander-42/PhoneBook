const AddInput = ({text, value, onChange}) => {
    return (
      <div>
        {text}: <input
          value = {value}
          onChange = {onChange}
          />
      </div>
    )
}
  
const Button = ({type, text}) => {
    return (
      <div>
        <button type={type}>{text}</button>
      </div>
    )
}
  
const AddForm = ({
                    name, number, addPerson, 
                    newName, newNumber, 
                    handleNameChange, 
                    handleNumberChange}) => {
    return (
      <form onSubmit={addPerson}>
          <AddInput text = {name} value = {newName} onChange = {handleNameChange}/>
          <AddInput text = {number} value = {newNumber} onChange = {handleNumberChange}/>
          <Button type = {"submit"} text = {"add"}/>
        </form>
    )
}

export default AddForm