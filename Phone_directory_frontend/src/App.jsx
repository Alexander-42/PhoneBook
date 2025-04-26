import { useState, useEffect } from 'react'
import personService from './services/persons'

import SearchFilter from './jsxModules/SearchFilter'
import AddForm from './jsxModules/AddForm'
import ShowPersons from './jsxModules/ShowPersons'
import Header2 from './jsxModules/Headers'
import ErrorNotification from './jsxModules/ErrorNotification'
import SuccessNotification from './jsxModules/SuccessNotification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then((response) => {
        setPersons(response.data)
      })
  }, [])

  const updateExisting = (existingPerson) => {
    const confirmChange = window.confirm(
      `${newName} is already added to the phonebook, replace the old number with a new one?`
    )
    
    if (confirmChange) {
      if (newNumber === '') {
        setErrorMessage(
          'Please add a number'
        )
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setErrorMessage(null)
        }, 1000)
        return
      }
      personService
        .update(existingPerson.id, {name: newName, number: newNumber})
        .then((returnedPerson) => {
          setPersons(persons.map((person) => 
          (person.id !== existingPerson.id ? person : returnedPerson.data)))
          setSuccessMessage(
            `Number for ${existingPerson.name} was successfully updated`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
        }
      ).catch((error) => {
        if (JSON.stringify(error.response.data).includes('is not a valid phone number')) {
          setErrorMessage(
            `${JSON.stringify(error.response.data)}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        } else {
        console.log(JSON.stringify(error.response.data))
          setErrorMessage(
            `${newName} was already removed from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
          setPersons(persons.filter((n) => n.id !== existingPerson.id))
        }
      })
    } else {
      setSuccessMessage(`Number for ${existingPerson.name} was not changed`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    }
    setNewName('')
    setNewNumber('')
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find((person) => (person.name === newName))

    if (existingPerson) {
      updateExisting(existingPerson)
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      
      personService
        .create(nameObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
        })
        .catch(error => {
          setErrorMessage(JSON.stringify(error.response.data))
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDiscard = (id, name) => {
    const confirmDiscard = window.confirm(`Delete ${name}`)
    if (confirmDiscard) {
      personService
        .discard(id)
        .then((response) => {
          setSuccessMessage(`Deleted ${name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
          personService.getAll().
            then((response) => {
              setPersons(response.data)
            })
        }).catch((error) => {
          setErrorMessage(
            `${name} was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
          setPersons(persons.filter((n) => n.id !== id))
        })
    } else {
      setSuccessMessage("Deletion cancelled")
      setTimeout(()=>{
        setSuccessMessage(null)
      }, 2000)
    }
  }

  const personsToShow = persons.filter((person) => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  return (
    <div>
      <Header2 text={"Phonebook"}/>
      <ErrorNotification message = {errorMessage}/>
      <SuccessNotification message = {successMessage}/>
      <SearchFilter text = {"filter shown with"} 
                    newFilter = {newFilter} 
                    handleFilterChange = {handleFilterChange}
      />
      <Header2 text={"Add new"}/>
      <AddForm name = {"name"} 
               number = {"number"} 
               addPerson = {addPerson} 
               newName = {newName} 
               newNumber={newNumber} 
               handleNameChange={handleNameChange} 
               handleNumberChange={handleNumberChange}
      />
      <Header2 text={"Numbers"}/>
      <ShowPersons personsToShow={personsToShow} handleDiscard={handleDiscard}/>
    </div>
  )

}

export default App