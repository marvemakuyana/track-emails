const express = require('express');
const dotenv = require('dotenv');


const app = express();
dotenv.config();



app.use('/api/send', require('./routes/api/send_email'));
app.use('/api/delete', require('./routes/api/delete_emails'));
app.use('/api/viewLabel', require('./routes/api/view_specific_label'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started...'));