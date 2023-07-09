// NOTE: USING ASYNC FUNCTIONS INSTEAD OF THEN-BLOCKS!

require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const personControllers = require("./controllers/person-controllers.js");
const HttpError = require("./models/http-error");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :response-time ms :body"));

app.get("/info", (req, res) => {
  const infoText = `Phonebook has info for ${persons.length} people`;
  const timeStamp = new Date().toLocaleString();

  res.send(`${infoText}<br>${timeStamp}`);
});

app.get("/api/persons", personControllers.getPersons);

app.get("/api/persons/:id", personControllers.getPersonById);

app.delete("/api/persons/:id", personControllers.deletePerson);

app.post("/api/persons/", personControllers.addPerson);

app.put("/api/persons/:id", personControllers.editPerson);

const unknownEndpoint = (req, res) => {
  const error = new HttpError("Unknown endpoint", 404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(unknownEndpoint);
app.use(errorHandler);
