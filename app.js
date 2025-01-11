import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes/directory.js';
import cors from 'cors';
require('dotenv').config()

const port = process.env.PORT || 3001
const app = express();

app.use(express.json())
app.use(cors("http://localhost:3000"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);


mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    // Start server only after DB connection is successful
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch(err => {
    console.log("Error while connecting to database: " + err.message);
  });
