const express = require('express')
const morgan = require('morgan')

const app = express()

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

app.use(express.json())
app.use(express.static('dist'))

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
    response.send('<h1>Hello World!</h1>')
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find((note) => note.id === id)
  
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const id = Math.floor(Math.random()*10000)
    return String(id)
}
  
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

    const exists = persons.some((person) => (person.name === body.name))
    
    if (exists) {
        return response.status(400).json({
            error: 'name must be unique',
        })
    }

    const person = {
      name: body.name,
      number: body.number || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    notes = persons.filter((person) => person.id !== id)
  
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})