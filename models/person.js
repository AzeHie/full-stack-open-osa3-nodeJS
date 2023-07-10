const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Connecting to database failed:", err.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{7,8}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "phone number is required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
