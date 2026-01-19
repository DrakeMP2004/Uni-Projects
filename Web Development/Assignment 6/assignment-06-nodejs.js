// Program layout similar to Assignment 5 and modified it according in this https://www.youtube.com/watch?v=siYYMb19Knc and https://www.youtube.com/watch?v=ZDXPehu1I-w
// Set Up some shown in https://medium.com/techvblogs/build-crud-api-with-node-js-express-and-mongodb-e3aa58da3915
// Import necessary libraries
const express = require('express'); // Express framework for handling HTTP requests
const { MongoClient, ObjectId } = require('mongodb'); // MongoDB driver to connect to a MongoDB instance
const bodyParser = require('body-parser'); // Body-parser middleware to parse JSON bodies in requests

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB Connection String with authentication details (Consider using environment variables for sensitive data)
const uri = "mongodb+srv://mackenziepascual2023:u230361@cluster0.9uugh8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient
const client = new MongoClient(uri);

// Function to start the server and connect to MongoDB
// Start it by typing "node assignment-06-nodejs.js" in the terminal as it's in the directory path
async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Access the database and its collections
        const db = client.db("GymDatabase");
        const membersCollection = db.collection("gymMembers");
        const classesCollection = db.collection("gymClasses");
        const memberClassesCollection = db.collection("memberClasses");

        // Initialize routes for different resources
        initializeMemberRoutes(app, membersCollection);
        initializeClassRoutes(app, classesCollection);
        initializeMemberClassRoutes(app, memberClassesCollection);

        // Start listening for HTTP requests on a configurable port
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        process.exit(1); // Exit if connection fails
    }
}

// Call function to start the server
startServer();

// Route functions mostly tested in Postman as demonstrated from https://www.youtube.com/watch?v=Yq5VHCjrGBM
// Function to initialize routes for member management
function initializeMemberRoutes(app, membersCollection) {
    // Route to create a new member
    /*
    Create a New Member
    HTTP Method: POST
    URL: http://localhost:3000/members

    Body:
    json
    Copy code
    {
    "ID": 5,
    "Title": "Dr",
    "FirstName": "Joe",
    "LastName": "Maxwells",
    "EmailAddress": "joe@gmail.com",
    "PremiumMembership": true
    }
    //Model Schema as shown from https://www.youtube.com/watch?v=hk9aqUNBhl8

    Description: This request creates a new member in the database with the provided details.
    
    Taken from https://stackoverflow.com/questions/69329716/nodejs-error-when-making-a-post-request-err-http-headers-sent
    */
    app.post('/members', async (req, res) => {
        try {
            const result = await membersCollection.insertOne(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    // Route to search for members based on various criteria
    /*
    HTTP Method: GET
    URL Examples:
    To find all premium members: http://localhost:3000/members/search?premium=true
    To search by first name: http://localhost:3000/members/search?firstName=Joe
    To search by last name and premium status: http://localhost:3000/members/search?lastName=Maxwells&premium=true

    Combine any of the available parameters based on your needs.
    Action: Enter the URL with your chosen query parameters and click Send.
    Description: A list of members that match the query parameters. If no members match, an empty array should be returned.

    Taken from https://www.shecodes.io/athena/72173-what-does-req-query-do-in-express-js and https://www.geeksforgeeks.org/express-js-req-query-property/
    */
    app.get('/members/search', async (req, res) => {
        const query = {};
        if (req.query.firstName) {
            query.FirstName = req.query.firstName;
        }
        if (req.query.lastName) {
            query.LastName = req.query.lastName;
        }
        if (req.query.email) {
            query.EmailAddress = req.query.email;
        }
        if (req.query.premium !== undefined) {
            query.PremiumMembership = req.query.premium === 'true';
        }
        try {
            const members = await membersCollection.find(query).toArray();
            res.send(members);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
    // Route to retrieve a specific member by ID
    /*
    HTTP Method: GET
    URL: http://localhost:3000/members/5
    Replace 5 with the ID of the member you wish to retrieve.
    Action: Click Send.

    Description: The details of the member with ID 5, if they exist.

    Taken from https://forum.freecodecamp.org/t/review-for-my-api-im-a-beginner-please-help/278157/3
    */
    app.get('/members/:id', async (req, res) => {
        try {
            const member = await membersCollection.findOne({ ID: parseInt(req.params.id) });
            if (member) {
                res.send(member);
            } else {
                res.status(404).send("Member not found");
            }
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    // Route to update a member's information
    /*
    HTTP Method: PUT
    URL: http://localhost:3000/members/5 (Assuming '5' is the ID of the member you want to update)
    
    Body (raw, JSON):
    json
    Copy code
    {
    "LastName": "Samson",
    "PremiumMembership": false
    }
    
    //Add more any details if needed

    Click Send and expect the update acknowledgment in the response.

    Taken as well from https://forum.freecodecamp.org/t/review-for-my-api-im-a-beginner-please-help/278157/3
    */
    app.put('/members/:id', async (req, res) => {
        try {
            const updateData = { $set: req.body };
            const result = await membersCollection.updateOne({ ID: parseInt(req.params.id) }, updateData);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    // Route to delete a member
    /*
    HTTP Method: DELETE
    URL: http://localhost:3000/members/5 (Replace '5' with the ID of the member to delete)

    Click Send and look for a success acknowledgment in the response.
    */
    app.delete('/members/:id', async (req, res) => {
        try {
            const result = await membersCollection.deleteOne({ ID: parseInt(req.params.id) });
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    //fineOne(), updateOne() and deleteOne() methods learnt from https://www.mongodb.com/docs/manual/reference/method/js-collection/
}

// Functions for class management and member-class relationship follow a similar pattern logic
// as member management and are structured to handle CRUD operations for gym classes
// and the enrollment of members in classes.

function initializeClassRoutes(app, classesCollection) {
    /*
    Create a Gym Class
    HTTP Method: POST
    URL: http://localhost:3000/classes

    Body (raw, JSON):
    json
    Copy code
    {
    "ID": 5,
    "ClassName": "Spin Class",
    "ClassDay": "Friday",
    "SessionLength": 1,
    "Price": 25,
    "CurrentNumberOfMembers": 8
    }
    
    Click Send and verify the created class details in the response.
    */
    app.post('/classes', async (req, res) => {
        try {
            const result = await classesCollection.insertOne(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    /*
    Method: GET
    URL Examples:
    To find classes by name: http://localhost:3000/classes/search?className=Spin Class
    To search for classes on a specific day: http://localhost:3000/classes/search?classDay=Friday
    To find classes within a price range: http://localhost:3000/classes/search?price=25
    
    Action: Enter the URL with your chosen query parameters and click Send.
    Description: A list of gym classes that match the query parameters.
    */
    app.get('/classes/search', async (req, res) => {
        const query = {};
    
        if (req.query.className) {
            query.ClassName = req.query.className;
        }
        if (req.query.classDay) {
            query.ClassDay = req.query.classDay;
        }
        if (req.query.price) {
            query.Price = { $gte: parseInt(req.query.price) };
        }
    
        try {
            const classes = await classesCollection.find(query).toArray();
            res.send(classes);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    /*
    HTTP Method: GET
    URL: http://localhost:3000/classes/5
    Replace 5 with the ID of the class you wish to retrieve.
    Action: Click Send.

    Description: The details of the class with ID 5, if they exist.
    */
    app.get('/classes/:id', async (req, res) => {
        try {
            const gymClass = await classesCollection.findOne({ ID: parseInt(req.params.id) });
            if (gymClass) {
                res.send(gymClass);
            } else {
                res.status(404).send("Gym class not found");
            }
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
    
    
    /*
    HTTP Method: PUT
    URL: http://localhost:3000/classes/5 (Assuming '5' is the ID of the class you want to update)
    
    Body (raw, JSON):
    json

    Copy code
    {
    "Price": 35
    }
    
    //Add more any details if needed
     
    Click Send and expect the update acknowledgment in the response.
    */
    app.put('/classes/:id', async (req, res) => {
        try {
            const updateData = { $set: req.body };
            const result = await classesCollection.updateOne({ ID: parseInt(req.params.id) }, updateData);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
    
    /*
    HTTP Method: DELETE
    URL: http://localhost:3000/classes/5 (Replace '5' with the ID of the class to delete)

    Click Send and look for a success acknowledgment in the response.
    */
    app.delete('/classes/:id', async (req, res) => {
        try {
            const result = await classesCollection.deleteOne({ ID: parseInt(req.params.id) });
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
}



function initializeMemberClassRoutes(app, memberClassesCollection) {
    /*
    HTTP Method: POST
    URL: http://localhost:3000/member-classes
    
    Body:
    json

    Copy code
    {
    "MemberID": 1,
    "ClassIDs": [1,2,5]
    }
   
    Description: Enrolls a member with ID 123 in classes with IDs 456 and 789
    */
    app.post('/member-classes', async (req, res) => {
        try {
            const result = await memberClassesCollection.insertOne(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    /*
    HTTP Method: GET
    URL Examples:
    To find all classes linked to a specific member: http://localhost:3000/member-classes/search?memberID=1
    To find all members enrolled in a specific class: http://localhost:3000/member-classes/search?classID=5

    Action: Enter the URL with your chosen query parameters and click Send.
    Description: A list of member-class links that match the query parameters.
    */
    app.get('/member-classes/search', async (req, res) => {
        const query = {};
    
        if (req.query.memberID) {
            query.MemberID = parseInt(req.query.memberID);
        }
        if (req.query.classID) {
            query.ClassIDs = { $in: [parseInt(req.query.classID)] };
        }
    
        try {
            const memberClasses = await memberClassesCollection.find(query).toArray();
            res.send(memberClasses);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });

    /*
    HTTP Method: PUT
    URL: http://localhost:3000/member-classes/search?memberID=1
    
    Body (JSON):
    json

    Copy code
    {
    "ClassIDs": [1, 4, 5]
    }

    Action: Click Send.
    Description: Updates all member-class links for member ID 1 (change ID if needed), changing their enrolled classes. You should receive a response indicating how many documents were modified.
    */
    app.put('/member-classes/search', async (req, res) => {
        const filter = {};
        const updateData = { $set: req.body };
    
        if (req.query.memberID) {
            filter.MemberID = parseInt(req.query.memberID);
        }
    
        try {
            const result = await memberClassesCollection.updateMany(filter, updateData);
            if (result.modifiedCount === 0) {
                return res.status(404).send('No matching records found to update.');
            }
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
    
    /*
    HTTP Method: DELETE
    URL: http://localhost:3000/member-classes/search?memberID=1
    Action: Click Send.
    Description: Deletes all member-class links for member ID 1. The response will indicate how many documents were deleted.
    */
    app.delete('/member-classes/search', async (req, res) => {
        const query = {};
    
        if (req.query.memberID) {
            query.MemberID = parseInt(req.query.memberID);
        }
    
        try {
            const result = await memberClassesCollection.deleteMany(query);
            if (result.deletedCount === 0) {
                return res.status(404).send('No matching records found to delete.');
            }
            res.send(result);
        } catch (error) {
            res.status(500).send(error.toString());
        }
    });
}
/*
Database Design's Effect on Code Development:

- The database 'GymDatabase' is divided into three collections: gymMembers, gymClasses, and memberClasses.
- gymMembers collects information about gym members, such as names, contact information, and membership status.
- gymClasses contains information on classes available, such as the name, timetable, and price.
- memberClasses keeps track of which members are enrolled in which classes by associating member IDs to class IDs.

MongoDB's flexible data structure however implies that application code must frequently ensure accuracy and consistency, as the database does not enforce foreign key limitations or relational data integrity. This is seen in the code structure, where the logic must manage any inconsistencies and guarantee that actions like updates and deletes are properly reflected across connected collections.
*/


// OS: Windows 11 Pro
// Browsers: Google Chrome and Microsoft Edge
// Browers' Versions: Chrome Version: Version 124.0.6367.156 (Official Build) (64-bit), Edge Version: Version 124.0.2478.80 (Official build) (64-bit)