require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb+srv://akshvt:1234@cluster0.aqxp3ex.mongodb.net/moviestream';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB');
        const db = mongoose.connection.db;

        // Update the user
        const result = await db.collection('users').updateOne(
            { email: 'akshatsingh9102003@gmail.com' },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount > 0) {
            console.log('Successfully made akshatsingh9102003@gmail.com an admin!');
        } else {
            console.log('User not found in the database. Did you type the email correctly?');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1);
    });
