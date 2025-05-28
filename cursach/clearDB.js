const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
// const Comment = require('./models/Comment'); // если есть

mongoose.connect('mongodb://localhost:27017/car-trade-app')
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(err));

const clearDatabase = async () => {
  try {
    await Car.deleteMany({});
    await User.deleteMany({});
    // await Comment.deleteMany({});
    console.log('Database cleared!');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

clearDatabase();
