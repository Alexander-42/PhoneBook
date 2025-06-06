const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give pasword as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://alexanderoiling:${password}@phonebookdb.bnn4ejj.mongodb.net/phoneBookApp?
retryWrites=true&w=majority&appName=PhoneBookDB`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} else {
  console.log('Please enter name and number')
  process.exit(1)
}