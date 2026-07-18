require('dotenv').config();

const PORT = process.env.PORT;


const express = require('express');
const app = express();



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
