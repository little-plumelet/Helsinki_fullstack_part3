require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// Person's import must be after donenv, thus env variables would be avaliable
const Person = require("./models/person");
const e = require("express");

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

app.get("/api/persons", (_, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.find({
    _id: id,
  })
    .then((person) => {
      console.log("person = ", person);
      if (person.name) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      console.log("err =", err);
      next(err);
    });
});

app.post("/api/persons", (request, response, next) => {
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

  const person = new Person({
    name: request.body.name,
    phone: request.body.phone,
  });

  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch(err => next(err))
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndUpdate(
    { _id: id },
    { phone: request.body.phone },
    { new: true }
  )
    .then((person) => response.json(person))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.deleteOne({
    _id: id,
  })
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => next(err));
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
