const { request, response } = require("express");
const express = require("express");

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    phone: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phone: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phone: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
  },
];

const personsNumber = data.length;

const app = express();

app.use(express.json());

app.get("/api/persons", (_, response) => {
  response.json(data);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = data.find((person) => person.id === id);
  if (person) response.json(person);
  response.status(404).end()
});

app.post("/api/persons", (request, response) => {
  
  let id;
  while (!id) {
    const tmpId = Math.floor(Math.random() * 100) + 1;
    if (!data.find((person) => person.id === tmpId)) id = tmpId;
  }
  if (!request.body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!request.body.phone) {
    return response.status(400).json({
      error: 'phone number is missing'
    })
  }

  if (data.find((person) => request.body.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id,
    ...request.body
  }
  data = [...data, person];
  response.json(person);
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((person) => person.id !== id);
  response.status(204).end();
})

app.get("/info", (_, response) => {
  const date = new Date().toUTCString();
  response.send(`
      <div>
        Phonebook has info for ${personsNumber} people
      </div>
      <div>
        ${date}
      </div>
  `);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
