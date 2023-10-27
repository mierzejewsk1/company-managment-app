require('dotenv').config();

const express = require('express');

const userRoutes = require('./routes/user');
const workspaceRoutes = require('./routes/workspace');
const newsRoutes = require('./routes/news');
const messageRoutes = require('./routes/message');

const cors = require('cors');
const app = express();

const corsOptions = {
    exposedHeaders: 'response-header',
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/user', userRoutes);
app.use('/workspace', workspaceRoutes);
app.use('/news', newsRoutes);
app.use('/message', messageRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Listening on port 4000");
});