require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]


morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['body'](req, res)
    ].join(' ')
  }))

app.get('/', (request, response) => {
    response.send("<div> Hello World!</div>")
})
  
app.get('/info', (request, response) => {
    response.send(
        `
        <div>
            <div>
                Phonebook has info for ${persons.length} persons.
            </div>
            <div>
                ${new Date().toString()}
            </div>
        </div>
        `
    )
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({
        error: 'name missing',
      })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing',
        })
    }

    const person = new  Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    if (!number) {
        return response.status(400).json({
            error: 'number missing!',
        })
    }

    Person.findByIdAndUpdate(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})