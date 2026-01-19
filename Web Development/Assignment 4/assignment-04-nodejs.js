// Taken influence from https://raddy.dev/blog/using-node-js-with-mysql-crud-xampp-phpmyadmin/ and https://www.youtube.com/watch?v=UWEJhbAeGtU
// Back-End Application Development in Node.js
// Import required modules
const express = require('express');
const mysql = require('mysql');
const readline = require('readline');
const cors = require('cors');;

// Create Express app
const app = express();
const port = process.env.PORT || 8080; //Port Server Made from launch.json

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool
({
    connectionLimit: 10,
    host: 'webcourse.cs.nuim.ie', //Server Host from phpmyadmin
    user: 'u230361', //My Database Username
    password: 'aiN0fahwibeithai', //My Database Password
    database: 'cs230_u230361' //Database Name
});

// Function to execute SQL queries, took and edited from https://stackoverflow.com/questions/66767218/problem-with-promises-and-mysql-query-return-value
function executeQuery(sql, values) 
{
    return new Promise((resolve, reject) => 
    {
        pool.getConnection((err, connection) => 
        {
            if (err) reject(err);
            connection.query(sql, values, (err, result) => 
            {
                connection.release();
                if (err) reject(err);
                resolve(result);
            });
        });
    });
}

// Function to prompt user for input
function prompt(question) 
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => 
        {
            rl.close();
            resolve(answer);
        });
    });
}

// Main function to run the console application in the terminal, start console by inputting command "npm start" or "node assignment-04-nodejs.js"
// Ideas took from https://www.geeksforgeeks.org/console-in-javascript/ and https://stackoverflow.com/questions/44806135/why-no-return-await-vs-const-x-await
async function main() 
{
    console.log('Welcome to the User Management Console Application!\n');

    while (true) 
    {
        console.log('\nSelect an action:');
        console.log('1. Create a new user');
        console.log('2. Retrieve users by name');
        console.log('3. Update a user');
        console.log('4. Delete user records by email, phone, and name');
        console.log('5. Exit\n');

        // Prompt user for choice
        const choice = await prompt('Input your choice (1-5): ');

        // Perform action based on user choice
        switch (choice) 
        {
            case '1':
                // Gather user input to create a new user, prompts from https://www.w3schools.com/jsref/met_win_prompt.asp and const from https://www.w3schools.com/js/js_const.asp. Await, async from https://www.w3schools.com/js/js_async.asp
                const title = await prompt('Input title: ');
                const firstName = await prompt('Input first name: ');
                const surname = await prompt('Input surname: ');
                const mobileNumber = await prompt('Input mobile number: ');
                const emailAddress = await prompt('Input email address: ');
                const addressLine1 = await prompt('Input address line 1: ');
                const addressLine2 = await prompt('Input address line 2: ');
                const town = await prompt('Input town: ');
                const countyOrCity = await prompt('Input county or city: ');
                const eircode = await prompt('Input Eircode: ');

                // Call createUser function
                await createUser(title, firstName, surname, mobileNumber, emailAddress, addressLine1, addressLine2, town, countyOrCity, eircode);
                break;

            case '2':
                // Retrieve users by name
                const name = await prompt('Input first name to search: ');
                await retrieveUsersByName(name);
                break;

            case '3':
                // Update a user
                const id = await prompt('Input user ID to update: ');
                const updatedTitle = await prompt('Input updated title: ');
                const updatedMobileNumber = await prompt('Input updated mobile number: ');
                const updatedEmailAddress = await prompt('Input updated email address: ');
                const updatedAddressLine1 = await prompt('Input updated address line 1: ');
                const updatedAddressLine2 = await prompt('Input updated address line 2: ');
                const updatedTown = await prompt('Input updated town: ');
                const updatedCountyOrCity = await prompt('Input updated county or city: ');
                const updatedEircode = await prompt('Input updated Eircode: ');

                // Call updateUser function
                await updateUser(id, updatedTitle, updatedMobileNumber, updatedEmailAddress, updatedAddressLine1, updatedAddressLine2, updatedTown, updatedCountyOrCity, updatedEircode);
                break;

            case '4':
                // Delete user records
                const deleteEmail = await prompt('Input email to delete: ');
                const deletePhone = await prompt('Input phone number to delete: ');
                const deleteName = await prompt('Input name to delete: ');

                // Call deleteUserByEmailPhoneAndName function
                await deleteUserByEmailPhoneAndName(deleteEmail, deletePhone, deleteName);
                break;

            case '5':
                // Exit the application
                console.log('Exiting application...');
                process.exit(0);

            default:
                console.log('Invalid choice. Please select a number between 1 and 5.');
                break;
        }
    }
}

// Run the main function
main().catch(console.error);

// CRUD Functions, most taken from https://stackoverflow.com/questions/64131001/how-do-i-get-this-function-to-run-synchronously
// Function to create a new user record
async function createUser(title, firstName, surname, mobileNumber, emailAddress, addressLine1, addressLine2, town, countyOrCity, eircode) 
{
    try 
    {
        // Prepare user data
        const userData = { Title: title, FirstName: firstName, SurName: surname, MobileNumber: mobileNumber, EmailAddress: emailAddress };
        // Prepare address data
        const addressData = { AddressLine1: addressLine1, AddressLine2: addressLine2, Town: town, CountyOrCity: countyOrCity, Eircode: eircode };

        // Insert address record
        const addressInsert = await executeQuery('INSERT INTO Addresses SET ?', addressData);
        const addressID = addressInsert.insertId; // Get the auto-generated AddressID

        // Insert user record
        const userInsert = await executeQuery('INSERT INTO PersonalInformation SET ?', userData);
        const userID = userInsert.insertId; // Get the auto-generated UserID

        // Insert into UserAddresses to link user with address
        await executeQuery('INSERT INTO UserAddresses (UserID, AddressID) VALUES (?, ?)', [userID, addressID]);

        console.log(`User with ID ${userID} and address with ID ${addressID} has been created.`);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

// Function to retrieve users matching a supplied name
async function retrieveUsersByName(name) 
{
    try 
    {
        // Construct SQL query to retrieve users
        const query = `SELECT * FROM PersonalInformation WHERE CONCAT(Title, ' ', FirstName, ' ', SurName) LIKE '%${name}%'`;

        // Execute query and return results
        const users = await executeQuery(query);
        console.log('Users matching the name:', users);
        return users;
    } 
    catch (error) 
    {
        console.error('Error retrieving users:', error);
        return [];
    }
}

// Function to update user record and address
async function updateUser(id, title, mobileNumber, emailAddress, addressLine1, addressLine2, town, countyOrCity, eircode) {
    try 
    {
        // Prepare user data
        const userData = { Title: title, MobileNumber: mobileNumber, EmailAddress: emailAddress };
        // Prepare address data
        const addressData = { AddressLine1: addressLine1, AddressLine2: addressLine2, Town: town, CountyOrCity: countyOrCity, Eircode: eircode };

        // Update user record
        await executeQuery('UPDATE PersonalInformation SET ? WHERE UserID = ?', [userData, id]);

        // Retrieve AddressID for the given UserID
        const addressResult = await executeQuery('SELECT AddressID FROM UserAddresses WHERE UserID = ?', [id]);
        const addressID = addressResult[0].AddressID;

        // Update address record
        await executeQuery('UPDATE Addresses SET ? WHERE AddressID = ?', [addressData, addressID]);

        console.log(`User with ID ${id} and address with ID ${addressID} has been updated.`);
    } 
    catch (error) 
    {
        console.error('Error updating user:', error);
    }
}

// Function to delete user records matching a combination of Email, Phone, and Name
async function deleteUserByEmailPhoneAndName(email, phone, name) 
{
    try 
    {
        // Retrieve UserID using the provided parameters
        const userQuery = `SELECT UserID FROM PersonalInformation WHERE EmailAddress = ? AND MobileNumber = ? AND CONCAT(Title, ' ', FirstName, ' ', SurName) = ?`;
        const userResult = await executeQuery(userQuery, [email, phone, name]);

        if (userResult.length === 0) {
            console.error('No user found with the provided details.');
            return;
        }

        const userID = userResult[0].UserID;

        // Retrieve AddressID using UserID from UserAddresses table
        const addressQuery = 'SELECT AddressID FROM UserAddresses WHERE UserID = ?';
        const addressResult = await executeQuery(addressQuery, [userID]);

        if (addressResult.length === 0) {
            console.error('No address found for the user.');
            return;
        }

        const addressID = addressResult[0].AddressID;

    // Delete user records from UserAddresses table
    await executeQuery('DELETE FROM UserAddresses WHERE UserID = ?', [userID]);

    // Delete the record from the address table
    await executeQuery('DELETE FROM Addresses WHERE AddressID = ?', [addressID]);

    // Delete the user record from PersonalInformation table
    await executeQuery('DELETE FROM PersonalInformation WHERE UserID = ?', [userID]);

    console.log(`User records matching the combination of Email: ${email}, Phone: ${phone}, and Name: ${name} have been deleted.`);
    } 
    catch (error) 
    {
        console.error('Error deleting user records:', error);
    }
}

// CRUD Routes
// Create a new user route from post functions as demonstrated from https://www.geeksforgeeks.org/express-js-app-post-function/ for AJAX in html file
app.post('/createUser', async (req, res) => 
{
    // Extracting user data from request body
    const { title, firstName, surname, mobileNumber, emailAddress, addressLine1, addressLine2, town, countyOrCity, eircode } = req.body;
    // Call createUser function
    await createUser(title, firstName, surname, mobileNumber, emailAddress, addressLine1, addressLine2, town, countyOrCity, eircode);
    // Respond with success message
    res.json({ message: 'User created successfully' });
});

// Retrieve users by name route
app.get('/retrieveUsers/:name', async (req, res) => 
{
    // Extracting name from URL parameter
    const { name } = req.params;
    // Call retrieveUsersByName function
    const users = await retrieveUsersByName(name);
    // Respond with retrieved users
    res.json(users);
});

// Server listens on specified port
app.listen(port, () => 
{
    console.log(`Server is running on port ${port}`);
});