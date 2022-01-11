const express = require('express');
const dotenv = require('dotenv');


const app = express();
dotenv.config();



app.use('/api/send', require('./routes/api/send_email'));
app.use('/api/delete', require('./routes/api/delete_emails'));
app.use('/api/viewLabel', require('./routes/api/view_specific_label'));
app.use('/api/createLabel', require('./routes/api/create_email_label'));
app.use('/api/deleteLabel', require('./routes/api/delete_email_labels'));
app.use('/api/addLabel', require('./routes/api/add_email_label'));
app.use('/api/removeLabel', require('./routes/api/remove_email_label'));
app.use('/api/viewEmails', require('./routes/api/view_emails'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started...'));