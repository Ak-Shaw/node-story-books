const mongoose = require("mongoose");

// When you work with mongoose, you're working with promises
const connectDB = async () => {
  try {
    // We want to await `mongoose.connect()` since it returns a promise
    // `process.env.MONGO_URL` is the connection string here
    // As the second argument, we're providing some options to avoid any warnings in the console
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// So that we can run this in the `app.js` file
module.exports = connectDB;
