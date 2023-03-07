require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// Person's import must be after donenv, thus env variables would be avaliable
const Person = require("./models/person");

const app = express();

const format =
  ":method :url :status :res[content-length] - :response-time ms :req-body";

morgan.token("req-body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(morgan(format));

app.get("/api/persons", (_, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person
  .find({
    _id: id,
  })
  .then((person) => {
    console.log('person = ', person)
    if (person.name) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch((err) => {
    console.log('err =', err);
    response.status(400).send({error: 'malformatted id'});
  })
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!request.body.phone) {
    return response.status(400).json({
      error: "phone number is missing",
    });
  }

  if (data.find((person) => request.body.name === person.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: request.body.name,
    phone: request.body.phone,
  });

  person.save().then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.deleteOne({
    _id: id,
  }).then(() => {
    response.status(204).end();
  });
});

// app.get("/info", (_, response) => {
//   const date = new Date().toUTCString();
//   response.send(`
//       <div>
//         Phonebook has info for ${personsNumber} people
//       </div>
//       <div>
//         ${date}
//       </div>
//   `);
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
