# Track Emails

An email api that keeps track of gmail inboxes and the emails that get sent between the inboxes using Node.js and Express.js

# Setting up

1 git clone [this repo] [prefferedFolderName] 
2 cd [prefferedFolderName]
3 Save the configuration file , .env file and token.json file in the root folder
4 npm install

# Running the app

npm start

# Running the api in Postman
All apis are GET requests. Select Authorization, under type select oAuth 2.0. Enter the refresh_token (found in the configuration file)


1 send an email: (http://localhost:5000/api/send)
2 delete emails: (http://localhost:5000/api/delete)
3 create a label: (http://localhost:5000/api/createLabel)
4 delete a label: (http://localhost:5000/api/deleteLabel)
5 add a label to an email: (http://localhost:5000/api/addLabel)
6 remove a label from an email: (http://localhost:5000/api/removeLabel)
7 see all the emails that have a specific label: (http://localhost:5000/api/viewLabel)
8 see all emails that have been sent from another email address: (http://localhost:5000/api/viewEmails)







