const { default: mongoose } = require('mongoose');

const connectDB = async () => {
  try {
    // mongodb Connecion string
    const con = await mongoose.connect(process.env.DBLINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
