//require('dotenv').config();

const express = require('express');

//routes files

const cors = require('cors');
const app = express();

const corsOptions = {
  exposedHeaders: 'response-header',
};

app.use(express.json());
app.use(cors(corsOptions));

// routes

app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening on port 4000");
});
//TEST COMMIT