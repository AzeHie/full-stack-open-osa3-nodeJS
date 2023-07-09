// NOTE: USING ASYNC FUNCTIONS INSTEAD OF THEN-BLOCKS!

require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const personControllers = require("./controllers/person-controllers.js");
const HttpError = require("./models/http-error");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :response-time ms :body"));

app.get("/info", async(req, res, next) => {
  try {
    const numbOfPersons = await Person.countDocuments({}, {hint: "_id_"});
    const infoText = `Phonebook has info for ${numbOfPersons} people`;
    const timeStamp = new Date().toLocaleString();
  
    res.send(`${infoText}<br><br>${timeStamp}`);
  } catch (err) {
    return next(new HttpError("Failed to load info data!", 500));
  }
});

app.get("/api/persons", personControllers.getPersons);

app.get("/api/persons/:id", personControllers.getPersonById);

app.delete("/api/persons/:id", personControllers.deletePerson);

app.post("/api/persons/", personControllers.addPerson);

app.put("/api/persons/:id", personControllers.editPerson);

const unknownEndpoint = (req, res, next) => {
  return next(new HttpError("Unknown endpoint", 404));
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
