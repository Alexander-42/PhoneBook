const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})

function phoneNumberValidator(number) {
  console.log('validating', number)
  const segments = number.split('-')
  
  if (segments.length !== 2) {
    return false
  }

  const [first, second] = segments

  if (!/^\d{2,3}$/.test(first)) {
    return false
  }

  if (!/^\d+$/.test(second)) {
    return false
  }

  const total = first.length + second.length
  if (total < 8) {
    return false
  }

  return true
}

const personSchema = new mongoose.Schema({
  name: { 
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      message: props => `${props.value} is not a valid phone number, use the format xxx-xxxxx... or xx-xxxxxx...`
    },
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)