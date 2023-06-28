const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms :body'));

app.get("/info", (req, res) => {
  const infoText = `Phonebook has info for ${persons.length} people`;
  const timeStamp = new Date().toLocaleString();

  res.send(`${infoText}<br>${timeStamp}`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const nameExists = persons.find((person) => person.name === req.body.name);
  if (nameExists) {
    res.status(409).json({
      message: "Person name has to be unique.",
    });
  }

  const numberExists = persons.find(
    (person) => person.number === req.body.number
  );
  if (numberExists) {
    res.status(409).json({
      message: "Number has to be unique.",
    });
  }

  if (!req.body.name || !req.body.number) {
    res.status(400).json({
      message: "Name or number cannot be empty!",
    });
  }

  let newPerson = {
    id: Math.floor(Math.random() * 101),
    name: req.body.name,
    number: req.body.number,
  };
  const idExists = persons.find((person) => person.id === newPerson.id);
  if (idExists) {
    newPerson.id += 1;
  }

  persons.push(newPerson);

  res.status(201).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
