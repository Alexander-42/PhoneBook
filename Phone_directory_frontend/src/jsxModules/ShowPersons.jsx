const ShowPersons = ({personsToShow, handleDiscard}) => {
    return (
      <div>
        {personsToShow.map( person =>
          <div key = {person.id}>
            <ShowPerson name = {person.name} number = {person.number} handleDiscard = {handleDiscard} id={person.id}/>
          </div>
        )}
      </div>
    )
  }
  
const ShowPerson = ({id, name, number, handleDiscard}) => {
    return (
      <div key={id}>
        {name} {number} { } 
        <DiscardButton handleDiscard={handleDiscard} id={id} name={name}/>
      </div>
    )
}

const DiscardButton = ({handleDiscard, id, name}) => {
  return (
    <button onClick={() => handleDiscard(id, name)}
    key={id}>
      delete
    </button>
  )
}

export default ShowPersons