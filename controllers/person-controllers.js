const Person = require("../models/person");
const HttpError = require("../models/http-error");

const getPersons = async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.status(200).json(persons);
  } catch (err) {
    const error = new HttpError("Failed to fetch phonebook!", 400);
    return next(error);
  }
};

const getPersonById = (req, res, next) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
};

const deletePerson = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Person.findByIdAndRemove(id);

    res.status(204).json("Person removed successfully!");
  } catch (err) {
    const error = new HttpError("Failed to remove a person from the phonebook!", 400);
    return next(error);
  }
};

const addPerson = async (req, res, next) => {
  let newPerson = new Person({ name: req.body.nam, number: req.body.numbe });

  try {
    await newPerson.save();
    res.status(201).json("New person added successfully!");
  } catch (err) {
    const error = new HttpError("Failed to add new person, check your details and try again!", 400);
    return next(error);
  }
}

exports.getPersons = getPersons;
exports.getPersonById = getPersonById;
exports.deletePerson = deletePerson;
exports.addPerson = addPerson;
