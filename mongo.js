const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [, , password, name, phone] = process.argv;

const url = `mongodb+srv://little-plumelet:${password}@helsinkifullstackphoneb.neloksj.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  phone,
});

const getAll = () => {
  Person.find({}).then((result) => {
    result.forEach(({ name, phone }) => {
      console.log(name, " ", phone);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  console.log("Phonebook: ");
  getAll();
}

if (name && phone) {
  person.save().then(({name, phone}) => {
    console.log("added ", name, "number ", phone, "to phonebook");
    mongoose.connection.close();
  });
}
