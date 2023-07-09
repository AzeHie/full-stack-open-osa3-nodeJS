const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);
mongoose.connect(url).then(res => {
  console.log('connected to database');
})
.catch((err) => {
  console.log('Connecting to database failed:', err.message);
});

const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  number: {type: String, required: true }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);