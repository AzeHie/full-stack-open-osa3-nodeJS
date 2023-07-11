const Person = require('../models/person');
const HttpError = require('../models/http-error');

const getPersons = async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.status(200).json(persons);
  } catch (err) {
    return next(new HttpError('Failed to fetch phonebook!', 400));
  }
};

const getPersonById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const person = await Person.findOne({ _id: id });
    if(!person) {
      return next(new HttpError('Person with specified ID not found', 404));
    }

    res.status(200).json(person);
  } catch (err) {
    return next(new HttpError('Failed to fetch person!', 400));
  }
};

const deletePerson = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Person.findByIdAndRemove(id);

    res.status(204).json('Person removed successfully!');
  } catch (err) {
    return next(new HttpError('Failed to remove a person from the phonebook!', 400));
  }
};

const addPerson = async (req, res, next) => {
  let newPerson = new Person({ name: req.body.name, number: req.body.number });

  try {
    await newPerson.save();
    res.status(201).json('New person added successfully!');
  } catch (err) {
    if(err.errors.name) {
      return next(new HttpError(err.errors.name, 400));
    } else if (err.errors.number) {
      return next(new HttpError(err.errors.number, 400));
    }
    return next(new HttpError('Failed to add new person, check your details and try again!', 400));
  }
};

const editPerson = async (req, res, next) => {
  const newNumber = req.body.number;
  const id = req.params.id;

  try {
    await Person.findOneAndUpdate({ _id: id  }, { $set: { number: newNumber } });
    res.status(200).json({ message: 'Number updated successfully!' });
  } catch (err) {
    return next(new HttpError('Failed to update the number!', 400));
  }
};

exports.getPersons = getPersons;
exports.getPersonById = getPersonById;
exports.deletePerson = deletePerson;
exports.addPerson = addPerson;
exports.editPerson = editPerson;
