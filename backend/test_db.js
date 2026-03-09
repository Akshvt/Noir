const mongoose = require('mongoose');
const uri = 'mongodb+srv://akshvt:1234@cluster0.aqxp3ex.mongodb.net/';
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
