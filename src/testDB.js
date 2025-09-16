const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const run = async () => {
  await connectDB();

  const newUser = new User({
    name: "Aadil",
    email: "Aadil@example.com",
    password: "123456",
  });

  await newUser.save();
  console.log(" User saved:", newUser);
  process.exit();
};

run();
