# RUN App

Authors: Alec Creasy, Chris Witt, Ahmad Mohammad

## Overview

Many people want to get active but don’t know where to run or how to get started. Our app makes it easy by plotting a path based on your needs, and can give you multiple running routes using the Google Maps API, Express, Node.js, and React.

# Instructions

These instructions will assume a Linux environment and a general working knowledge of the Linux CLI, as well as knowledge of the Google Maps API. For other Operating Systems, we will be sure to provide further documentation at a later date.

## Prerequisites

### Node.JS

You will need Node.js to get started. You can usually install it using the apt repository

```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

This will install Node.js, a runtime environment for JavaScript, and the Node Package Manager.

### Environment setup

Beyond this, you will need to configure the environment.

In **my-react-app**, locate the .env file.

You should see these two fields:

```
VITE_GOOGLE_MAPS_API_KEY=<KEY GOES HERE>
VITE_API_URL=<BACKEND API URL GOES HERE>
```

Replace each of these fields with your Google Maps API key and URL for the backend server.

In **backend**, locate the .env file.

You should see these fields:

```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=RUN_App
DB_PORT=3306
```

You can adjust these as needed. **PORT** refers to the port the server should run on (default is 8080), **DB_HOST** is the host IP of the database (localhost by default), **DB_USER** is the username the database is registered under (root by default), **DB_PASSWORD** is the password for the database (empty by default), **DB_NAME** is the schema name (default is RUN_App), and **DB_PORT** is the port the SQL server is running on (MySQL's default is 3306, shouldn't need to be changed).

## Installation Instructions

### Node.JS installation

To get started, you will need to install all packages for both the backend and the frontend. While in the root directory of the project, you will need to run this command in both the **backend** and **my-react-app** directories:

```
npm install
```

To make things even simpler, you can simply copy and paste these commands below when in the project's root directory:
```
cd my-react-app
npm install
cd ../backend
npm install
```

After this, you will have all the packages necessary and be able to run the Vite and Express servers.

You're nearly done, now all you need is XAMPP. It can be downloaded here: https://www.apachefriends.org/

### MySQL database setup

This will run the Apache and MySQL servers. Apache is only necessary for visualizing the MySQL database through phpMyAdmin and can be disabled if you are comfortable with the CLI.

The default install location for the XAMPP debian file is:

```
/opt/lampp/
```

Navigate to this directory and as a superuser, run the GUI Linux manager:

```
sudo ./manager-linux-x64.run
```

Within here, start up the MySQL database and Apache server (if necessary).

Once the MySQL and Apache servers are running, go to the following url: http://localhost/phpmyadmin/

This will take you to phpMyAdmin. From here, you need to create the database schema.

At the top of the page, click **SQL** and type the following command:

```
CREATE DATABASE RUN_App;
```

This will create the schema (should be on the left!). Click it.

From here, click **Import** at the top and select **Choose File**. Select the .SQL file found in **/backend/SQL_Source/**. This will import the database tables.

Great! Everything is installed and ready to go!

## Execution Instructions

Currently, you will need 2 separate terminals to run the Vite and Express servers.

### Vite Server

This will run the frontend web server. You will need to be in the **my-react-app** directory. When there, run this command:

```
npm start
```

This will start the Vite server on port 5173.

### Express Server

This will run the backend web server. You will need to be in the **backend/src** directory. When there, run this command:
```
node server.js
```

This will start the Express server

### MySQL

MySQL should be running already, thanks to our installation step. If it is not, refer to the above (at this point, Apache is no longer necessary).

# Input and Output Explanation

## Inputs

The inputs to this project are feature data such as elevation, destination type, target route length, and route shape.

Other potential inputs are a username, email address, and password for account management.

## Outputs

The outputs include routes fitting the input criteria, as well as any saved routes if logged in and viewing the dashboard.

# Features

- Route Finder 
- Login Page
- Saving Favorite routes
- Customizable routes (Elevation, Distance Target, etc.)

### Potential Future Features

- Add a administrator pipeline for better logging and easier management.
- Secure Password Requirements
- Best Time (maybe by built-in stopwatch)
- Button to locate you,
- Textbox for the number of miles or meters
- Goals: time, miles, amount per week

# Acknowledgements

### Tech Stack

- JavaScript/TypeScript (Langauge)
- React (Frontend)
- Google Maps API (Location)
- MySQL (Database),
- Express (Backend),
- Bcrypt (For encrypting passwords),
- Apache XAMPP (Web Server Control Panel)
