
// Program layout similar to Assignments 5 and 6 for the beginning and start servers method and modified it according in this https://www.youtube.com/watch?v=siYYMb19Knc and https://www.youtube.com/watch?v=ZDXPehu1I-w
// More things about setting up Backend Servers are made as learnt in https://www.youtube.com/watch?v=Fn8ui4hW3PE for implementing parsed JSONs

// Backend Solution
// Import necessary libraries
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Import validation utilities from express-validator
const { body, param, validationResult } = require('express-validator');

// Import CORS middleware to allow cross-origin requests, mentionned in https://www.youtube.com/watch?v=-ObfwD0RkAI
const cors = require('cors');

// Enable CORS for all routes, making API accessible from different domains so Frontend can be more accessible, first used in Assignment 4 for AJAX
// "npm install cors" command to use it
app.use(cors());

// Middleware to parse JSON bodies into JS objects accessible via req.body
app.use(bodyParser.json());

// MongoDB Connection String
const uri = "mongodb+srv://mackenziepascual2023:u230361@cluster0.9uugh8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient
const client = new MongoClient(uri);

// Start server and connect to MongoDB
// Run it using "node summer-exam-coding-assignment-nodejs.js" command in the terminal in the folder directory
async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Access the database and its collections
        const db = client.db("RentManagement");
        const landlordsCollection = db.collection("Landlords");
        const tenantsCollection = db.collection("Tenants");
        const contractsCollection = db.collection("TenantLandlordContracts");

        // CRUD Tested in Postman
        // Define CRUD operations for Landlords
        // POST endpoint for creating a new landlord
        /*
        Sample
        URL: http://localhost:4000/landlords
        Method: POST
        
        Body: Raw JSON
        json
        {
          "title": "Mr",
          "firstName": "Jonathan",
          "surname": "Drews",
          "phoneNumber": "1234567890",
          "emailAddress": "jonathan.drews@outlook.com",
          "homeAddress": {
            "addressLine1": "119 Glave Street",
            "addressLine2":"Homesten Views"
            "town": "Glasnevin,
            "countyCity": "Town",
            "eircode": "YTR76B8"
          },
          "dateOfBirth": "1980-01-01",
          "permissionToRent": true,
          "permissionForEmail": true
        }
        */
        app.post('/landlords', [
            // Validation middleware as demonstrated in https://medium.com/@hcach90/using-express-validator-for-data-validation-in-nodejs-6946afd9d67e and https://www.geeksforgeeks.org/how-to-validate-data-using-express-validator-module-in-node-js/
            body('title').notEmpty().withMessage('Title is required'),
            body('firstName').notEmpty().withMessage('First name is required'),
            body('surname').notEmpty().withMessage('Surname is required'),
            body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
            body('emailAddress').isEmail().withMessage('Invalid email address'),
            body('homeAddress.addressLine1').notEmpty().withMessage('Address line 1 is required'),
            body('homeAddress.town').notEmpty().withMessage('Town is required'),
            body('homeAddress.countyCity').notEmpty().withMessage('County/City is required'),
            body('homeAddress.eircode').notEmpty().withMessage('Eircode is required'),
            body('dateOfBirth').isDate().withMessage('Invalid date of birth format'),
            body('permissionToRent').isBoolean().withMessage('Permission to Rent must be true or false'),
            body('permissionForEmail').isBoolean().withMessage('Permission for Email must be true or false'),
            (req, res, next) => {
                // Check validation result and return errors if any
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            }
        ], 
        async (req, res) => {
            // Insert the new landlord into the database
            const result = await landlordsCollection.insertOne(req.body);
            res.status(201).json(result);
        });

        // GET endpoint to retrieve all landlords
        /*
        URL: http://localhost:4000/landlords
        Method: GET
        */
        app.get('/landlords', async (req, res) => {
            const landlords = await landlordsCollection.find({}).toArray();
            res.status(200).json(landlords);
        });

        // GET endpoint to retrieve a specific landlord by ID
        /*
        Sample
        URL: http://localhost:4000/landlords/663f8c0f54b73410e5ecb532 (Change object id if wish)
        Method: GET
        */
        app.get('/landlords/:id', [
            // isMongoID() for id parameter validation check, demonstrated from https://github.com/express-validator/express-validator/issues/438
            param('id').isMongoId().withMessage('Invalid landlord ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const landlord = await landlordsCollection.findOne({ _id: new ObjectId(req.params.id) });
            if (landlord) {
                res.status(200).json(landlord);
            } else {
                res.status(404).send('Landlord not found');
            }
        });

        // PUT endpoint to update a landlord by ID
        /*
        Sample
        URL: http://localhost:4000/landlords/663f8c0f54b73410e5ecb532 (Change object id if wish)
        Method: PUT

        Body: Raw JSON
        json
        {
            "phoneNumber": "1234567890"
        } 
        
        Extend Any details if wish
        */
        app.put('/landlords/:id', [
            param('id').isMongoId().withMessage('Invalid landlord ID format'),
            body('emailAddress').optional().isEmail().withMessage('Invalid email address'),
            body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const updateResult = await landlordsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            if (updateResult.modifiedCount === 0) {
                return res.status(404).send('No landlord with this ID found');
            }
            res.status(200).send('Updated successfully');
        });

        // DELETE endpoint to remove a landlord by ID
        /*
        /*
        Sample
        URL: http://localhost:4000/landlords/663f8c0f54b73410e5ecb532 (Change object id if wish)
        Method: DELETE
        */
        app.delete('/landlords/:id', [
            param('id').isMongoId().withMessage('Invalid landlord ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const deleteResult = await landlordsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (deleteResult.deletedCount === 0) {
                return res.status(404).send('No landlord with this ID found');
            }
            res.status(200).send('Deleted successfully');
        });

        // findOne(), updateOne() and deleteOne() methods learnt from https://www.mongodb.com/docs/manual/reference/method/js-collection/
        // deleteResult and updateResult layout modified method taken in https://docs.oracle.com/en/cloud/saas/field-service/fapcf/c-updateresult-method.html and https://www.mongodb.com/docs/drivers/node/v4.8/fundamentals/crud/write-operations/delete/

        // Additional CRUD operations for Tenants and Contracts can be similarly structured

        // Define CRUD operations for Tenants
        // Route Functions for http://localhost:4000/tenants are similar, except it doesn't contain additional details like birth-date from what landlords has 
        app.post('/tenants', [
            body('title').notEmpty().withMessage('Title is required'),
            body('firstName').notEmpty().withMessage('First name is required'),
            body('surname').notEmpty().withMessage('Surname is required'),
            body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
            body('emailAddress').isEmail().withMessage('Invalid email address'),
            body('homeAddress.addressLine1').notEmpty().withMessage('Address line 1 is required'),
            body('homeAddress.town').notEmpty().withMessage('Town is required'),
            body('homeAddress.countyCity').notEmpty().withMessage('County/City is required'),
            body('homeAddress.eircode').notEmpty().withMessage('Eircode is required'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            }
        ], 
        async (req, res) => {
            const result = await tenantsCollection.insertOne(req.body);
            res.status(201).json(result);
        });


        app.get('/tenants', async (req, res) => 
        {
            const tenants = await tenantsCollection.find({}).toArray();
            res.status(200).json(tenants);
        });

        app.get('/tenants/:id', [
            param('id').isMongoId().withMessage('Invalid tenant ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const tenant = await tenantsCollection.findOne({ _id: new ObjectId(req.params.id) });
            if (tenant) {
                res.status(200).json(tenant);
            } else {
                res.status(404).send('Tenant not found');
            }
        });
        
        app.put('/tenants/:id', [
            param('id').isMongoId().withMessage('Invalid tenant ID format'),
            body('emailAddress').optional().isEmail().withMessage('Invalid email address'),
            body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const updateResult = await tenantsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            if (updateResult.modifiedCount === 0) {
                return res.status(404).send('No tenant with this ID found');
            }
            res.status(200).send('Updated successfully');
        });
        

        app.delete('/tenants/:id', [
            param('id').isMongoId().withMessage('Invalid tenant ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const deleteResult = await tenantsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (deleteResult.deletedCount === 0) {
                return res.status(404).send('No tenant with this ID found');
            }
            res.status(200).send('Deleted successfully');
        });
        


        // Define CRUD operations for Contracts
        // JSON Body Structure is different as shown here
        /*
        Sample
        URL: http://localhost:4000/contracts
        Method: POST

        Body:
        json
        {
          "contractDate": "2024-01-01",
          "feeMonthly": "1000.00",
          "propertyAddress": "789 Saint's Road",
          "tenants": ["663f8c9254b73410e5ecb538", "663f8c9254b73410e5ecb539"],
          "landlord": "663f8c0f54b73410e5ecb532",
          "propertyDoorNumber": "111",
          "contractLength": "6 months",
          "propertyType": "Apartment"
        }

        Change ID values if wish
        */
        app.post('/contracts', [
            body('contractDate').isDate().withMessage('Invalid contract date format'),
            body('feeMonthly').isCurrency().withMessage('Invalid fee format'),
            body('propertyAddress').notEmpty().withMessage('Property address is required'),
            body('tenants').isArray().withMessage('Tenants should be an array'),
            body('landlord').notEmpty().withMessage('Landlord ID is required'),
            body('propertyDoorNumber').notEmpty().withMessage('Property door number is required'),
            body('contractLength').notEmpty().withMessage('Contract length is required'),
            body('propertyType').notEmpty().withMessage('Property type is required'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            }
        ], 
        async (req, res) => {
            const result = await contractsCollection.insertOne(req.body);
            res.status(201).json(result);
        });

        app.get('/contracts', async (req, res) => 
        {
            const contracts = await contractsCollection.find({}).toArray();
            res.status(200).json(contracts);
        });

        // GET endpoint to retrieve a specific contract by ID
        app.get('/contracts/:id', [
            param('id').isMongoId().withMessage('Invalid contract ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const contract = await contractsCollection.findOne({ _id: new ObjectId(req.params.id) });
            if (contract) {
                res.status(200).json(contract);
            } else {
                res.status(404).send('Contract not found');
            }
        });
        
        // Find a specific contract by its MongoDB ObjectId
        /*
        Sample
        URL: http://localhost:4000/contracts/663f904b54b73410e5ecb542
        Method: PUT

        Body:
        json
        {
            "feeMonthly": "1200.00"
        }

        Change and expand more details if wish
        */
        app.put('/contracts/:id', [
            param('id').isMongoId().withMessage('Invalid contract ID format'),
            body('feeMonthly').optional().isCurrency().withMessage('Invalid fee format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Update specific fields in the contract document
            const updateResult = await contractsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            if (updateResult.modifiedCount === 0) {
                return res.status(404).send('No contract with this ID found');
            }
            res.status(200).send('Updated successfully');
        });
        

        app.delete('/contracts/:id', [
            param('id').isMongoId().withMessage('Invalid contract ID format')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const deleteResult = await contractsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (deleteResult.deletedCount === 0) {
                return res.status(404).send('No contract with this ID found');
            }
            res.status(200).send('Deleted successfully');
        });
        



        // Start listening for HTTP requests
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } 
    catch (error) 
    {
        console.error("Could not connect to MongoDB", error);
        process.exit(1);
    }
}

startServer();

/* Database Design and API Development Notes: The Rent Management System database has three collections: landlords, tenants, and tenant-landlord contracts. 
* Each collection has been created to help with the CRUD operations required for maintaining rental properties:

* - Landlords and Tenants collections feature personal and contact information fields, with API-level validation to ensure data integrity. 
* - The TenantLandlordContracts collection connects tenants and landlords using IDs, allowing for complicated searches like as seeing all contracts for a certain landlord or tenant.

* Relationships between tenants and landlords allow growing queries and operations, but API development requires strong validation and error handling to maintain data accuracy. 
The API's design is directly reflective of the database's structure, with a focus on intuitive routes and strict data handling like strignifying and fetching procedures used from almost all previous assignment assessments to enable smooth communication between the front end and the database in MongoDB.
*/

// OS: Windows 11 Pro
// Browsers: Google Chrome and Microsoft Edge
// Browers' Versions: Chrome Version: Version 124.0.6367.158 (Official Build) (64-bit), Edge Version: Version 124.0.2478.97 (Official build) (64-bit)