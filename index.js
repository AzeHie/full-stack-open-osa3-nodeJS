// NOTE: USING ASYNC FUNCTIONS INSTEAD OF THEN-BLOCKS!

require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

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

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :response-time ms :body"));

app.get("/info", (req, res) => {
  const infoText = `Phonebook has info for ${persons.length} people`;
  const timeStamp = new Date().toLocaleString();

  res.send(`${infoText}<br>${timeStamp}`);
});

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

app.delete("/api/persons/:id", async(req, res) => {
  const id = req.params.id;
  
  try {
    await Person.findByIdAndRemove(id);

    res.status(204).json("Person removed successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
});

app.post("/api/persons/", async (req, res) => {
  let newPerson = new Person({ name: req.body.name, number: req.body.number });

  try {
    await newPerson.save();
    res.status(201).json("New person added successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
