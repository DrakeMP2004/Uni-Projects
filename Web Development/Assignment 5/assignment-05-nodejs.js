// Header Template as done in MongoDB as shown in https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
// Setups, Layouts and Modules are made up in https://www.youtube.com/watch?v=ayNI9Q84v8g and https://medium.com/@ibrahimhz/create-an-crud-app-with-express-js-mongodb-node-js-men-097569fcdc97
// Express can be intalled in the terminal as shown here https://expressjs.com/en/starter/installing.html if there's an error stated for that
// Import required modules
const readline = require('readline');
const { MongoClient, ObjectId } = require('mongodb');

// Connection String
const uri = "mongodb+srv://mackenziepascual2023:u230361@cluster0.9uugh8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient
const client = new MongoClient(uri);

// Assuming you have initialized your MongoDB client and connected to the database
// Define collections
const customersCollection = client.db("PhoneStore").collection("customers");
const itemsCollection = client.db("PhoneStore").collection("phones");
const ordersCollection = client.db("PhoneStore").collection("orders");

// Main function to run the console application
// Ideas took from https://www.geeksforgeeks.org/console-in-javascript/ and https://stackoverflow.com/questions/44806135/why-no-return-await-vs-const-x-await for setting up console application
// Also used in Assignment-04 for node.js file
async function main() 
{
    // Run it in the terminal as "node assignment-05-nodejs.js" when it's in its folder directory path. Otherwise use "npm start" from nodemon in package where you press control C once or twice if you want to cancel and quit running, this is slower though than the first way
    console.log("Connected to MongoDB");
    console.log('Welcome to the Phone Store Console Application!\n');

    // Select entity to run CRUD functions
    while (true) {
        console.log('\nSelect an entity to perform CRUD operations:');
        console.log('1. Customers');
        console.log('2. Phones');
        console.log('3. Orders');
        console.log('4. Exit\n');

        // Prompt user for choice
        const choice = await prompt('Input your choice (1-4): ');

        switch (choice) 
        {
            case '1':
                await handleCustomerCRUD();
                break;
            case '2':
                await handleItemCRUD();
                break;
            case '3':
                await handleOrderCRUD();
                break;
            case '4':
                console.log('Exiting application...');
                process.exit(0);
            default:
                console.log('Invalid choice. Please select a number between 1 and 4.');
                break;
        }
    }
}


// CRUD Terminal Function for Customers
async function handleCustomerCRUD() 
{
    console.log('\nCustomer CRUD Operations:');
    console.log('1. Create a new customer');
    console.log('2. Retrieve a random customer');
    console.log('3. Update a customer');
    console.log('4. Delete a customer');
    console.log('5. Back to main menu\n');

    const choice = await prompt('Input your choice (1-5): ');

    switch (choice) 
    {
        case '1':
            await insertCustomer(customersCollection);
            break;
        case '2':
            await findCustomer(customersCollection);
            break;
        case '3':
            await updateCustomer(customersCollection);
            break;
        case '4':
            await deleteCustomer(customersCollection);
            break;
        case '5':
            return;
        default:
            console.log('Invalid choice. Please select a number between 1 and 5.');
            break;
    }
}

// Function to create a new customer record
async function insertCustomer(customersCollection) 
{
    // Gather user input to create a new customer, prompts from https://www.w3schools.com/jsref/met_win_prompt.asp and const from https://www.w3schools.com/js/js_const.asp. Await, async from https://www.w3schools.com/js/js_async.asp
    const title = await prompt('Input title: ');
    const firstName = await prompt('Input first name: ');
    const surname = await prompt('Input surname: ');
    const mobile = await prompt('Input mobile number: ');
    const email = await prompt('Input email address: ');
    const addressLine1 = await prompt('Input address line 1: ');
    const addressLine2 = await prompt('Input address line 2: ');
    const town = await prompt('Input town: ');
    const countyOrCity = await prompt('Input county or city: ');
    const eircode = await prompt('Input Eircode: ');

    // Reforming Query for User Inputted Values
    const customer = 
    {
        "Title": title,
        "First Name": firstName,
        "Surname": surname,
        "Mobile": mobile,
        "Email Address": email,
        "Address": 
        {
            "Address Line 1": addressLine1,
            "Address Line 2": addressLine2,
            "Town": town,
            "County/City": countyOrCity,
            "EIRCODE": eircode
        }
    };

    // Finally Insert the Document
    await customersCollection.insertOne(customer);
    console.log('Customer created successfully');
}

// Function to retrieve a random customer
// Randomiser as Influenced from https://stackoverflow.com/questions/64120335/generate-random-document-from-mongodb-that-lasts-for-1-day. Applies for the other CRUD functions in entities
// Function to retrieve a random customer and log details
async function findCustomer(customersCollection) 
{
    const count = await customersCollection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomCustomer = await customersCollection.findOne({}, { skip: randomIndex });

    // Log Output Layout to avoid raw objects being printed in the terminal. Console Log Logic taken from https://discuss.codecademy.com/t/magic-eight-ball-help/407094/21
    console.log('Random Customer:');
    console.log(`Customer ID: ${randomCustomer._id}`)
    console.log(`Title: ${randomCustomer.Title}`);
    console.log(`Name: ${randomCustomer['First Name']} ${randomCustomer.Surname}`);
    console.log(`Mobile: ${randomCustomer.Mobile}`);
    console.log(`Email: ${randomCustomer['Email Address']}`);
    console.log('Address:');
    console.log(`  ${randomCustomer.Address['Address Line 1']}`);
    console.log(`  ${randomCustomer.Address['Address Line 2']}`);
    console.log(`  ${randomCustomer.Address.Town}`);
    console.log(`  ${randomCustomer.Address['County/City']}`);
    console.log(`  ${randomCustomer.Address.EIRCODE}`);
}

// Function to update a customer record
async function updateCustomer(customersCollection) 
{
    // Try Catch Algorithm from https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/
    try 
    {
        // Retrieve a random customer
        const count = await customersCollection.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomCustomer = await customersCollection.findOne({}, { skip: randomIndex });

        // Display current customer details
        console.log('Current Customer Details:', randomCustomer);

        // Prompt user for updated personal data
        const updatedMobile = await prompt('Input updated mobile number: ');
        const updatedEmail = await prompt('Input updated email address: ');
        const updatedTitle = await prompt('Input updated title: ');

        // Update personal data
        // UpdateOne method as shown in https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
        const updateData = { $set: { "Mobile": updatedMobile, "Email Address": updatedEmail, "Title": updatedTitle } };
        await customersCollection.updateOne({ _id: randomCustomer._id }, updateData);

        // Prompt user if they want to update address data
        const updateAddress = await prompt('Do you want to update the address data? (yes/no): ');

        if (updateAddress.toLowerCase() === 'yes') 
        {
            // Prompt user for new address details
            const updatedAddressLine1 = await prompt('Input updated address line 1: ');
            const updatedAddressLine2 = await prompt('Input updated address line 2: ');
            const updatedTown = await prompt('Input updated town: ');
            const updatedCountyOrCity = await prompt('Input updated county or city: ');
            const updatedEircode = await prompt('Input updated Eircode: ');

            // Update address data in the Query
            const updateAddressData = {
                $set: {
                    "Address.Address Line 1": updatedAddressLine1,
                    "Address.Address Line 2": updatedAddressLine2,
                    "Address.Town": updatedTown,
                    "Address.County/City": updatedCountyOrCity,
                    "Address.EIRCODE": updatedEircode
                }
            };

            await customersCollection.updateOne({ _id: randomCustomer._id }, updateAddressData);
        }

        console.log('Customer updated successfully');
    } 
    catch (error) 
    {
        console.error('Error updating customer:', error);
    }
}


// Function to delete customer records
async function deleteCustomer(customersCollection) 
{
    const email = await prompt('Input email to delete: ');
    const phone = await prompt('Input phone number to delete: ');
    const name = await prompt('Input name to delete: ');
    
    // DeleteMany Documents that matches the query details as shown in https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/
    const deleteQuery = { "Email Address": email, "Mobile": phone, "First Name": name }; // Delete By Email, Mobile Number and First Name
    const result = await customersCollection.deleteMany(deleteQuery);
    console.log(`${result.deletedCount} customer records deleted`);
}

// The Phones/Items entitiy have almost the same layout functions as the Customers
// CRUD Terminal Function for Items/Phones
async function handleItemCRUD() 
{
    console.log('\nItem CRUD Operations:');
    console.log('1. Create a new item');
    console.log('2. Retrieve a random item');
    console.log('3. Update an item');
    console.log('4. Delete an item');
    console.log('5. Back to main menu\n');

    const choice = await prompt('Input your choice (1-5): ');

    switch (choice) 
    {
        case '1':
            await insertItem(itemsCollection);
            break;
        case '2':
            await findItem(itemsCollection);
            break;
        case '3':
            await updateItem(itemsCollection);
            break;
        case '4':
            await deleteItem(itemsCollection);
            break;
        case '5':
            return;
        default:
            console.log('Invalid choice. Please select a number between 1 and 5.');
            break;
    }
}

// Function to create a new item
async function insertItem(itemsCollection) 
{
    const manufacturer = await prompt('Input manufacturer: ');
    const model = await prompt('Input model: ');
    const price = parseFloat(await prompt('Input price: '));

    const item = {
        "Manufacturer": manufacturer,
        "Model": model,
        "Price": price
    };

    await itemsCollection.insertOne(item);
    console.log('Item created successfully');
}

// Function to retrieve a random item
// Function to retrieve a random item and log details
async function findItem(itemsCollection) 
{
    const count = await itemsCollection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomItem = await itemsCollection.findOne({}, { skip: randomIndex });

    console.log('Random Item:');
    console.log(`Phone Item ID: ${randomItem._id}`);
    console.log(`Manufacturer: ${randomItem.Manufacturer}`);
    console.log(`Model: ${randomItem.Model}`);
    console.log(`Price: ${randomItem.Price}`);
}

// Function to update an item
async function updateItem(itemsCollection) 
{
    try 
    {
        // Retrieve a random item
        const count = await itemsCollection.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomItem = await itemsCollection.findOne({}, { skip: randomIndex });

        // Display current item details
        console.log('Current Item Details:', randomItem);

        // Prompt user for updated data
        const updatedManufacturer = await prompt('Input updated manufacturer: ');
        const updatedModel = await prompt('Input updated model: ');
        const updatedPrice = parseFloat(await prompt('Input updated price: '));

        // Update item data
        const updateData = {
            $set: {
                "Manufacturer": updatedManufacturer,
                "Model": updatedModel,
                "Price": updatedPrice
            }
        };

        await itemsCollection.updateOne({ _id: randomItem._id }, updateData);
        console.log('Item updated successfully');
    } 
    catch (error) 
    {
        console.error('Error updating item:', error);
    }
}

// Function to delete an item
async function deleteItem(itemsCollection) 
{
    const manufacturer = await prompt('Input manufacturer of item to delete: ');
    const model = await prompt('Input model of item to delete: ');

    const deleteQuery = { "Manufacturer": manufacturer, "Model": model };
    const result = await itemsCollection.deleteMany(deleteQuery);
    console.log(`${result.deletedCount} item records deleted`);
}

// CRUD Terminal Function for Orders
async function handleOrderCRUD() 
{
    console.log('\nOrder CRUD Operations:');
    console.log('1. Create a new order');
    console.log('2. Retrieve a random order');
    console.log('3. Update an order');
    console.log('4. Delete an order');
    console.log('5. Back to main menu\n');

    const choice = await prompt('Input your choice (1-5): ');

    // Methods take more than one collection parameter to get "_id"s from all three Entities
    switch (choice) 
    {
        case '1':
            await insertOrder(ordersCollection, itemsCollection, customersCollection);
            break;
        case '2':
            await findOrder(ordersCollection);
            break;
        case '3':
            await updateOrder(ordersCollection, itemsCollection, customersCollection);
            break;
        case '4':
            await deleteOrder(ordersCollection);
            break;
        case '5':
            return;
        default:
            console.log('Invalid choice. Please select a number between 1 and 5.');
            break;
    }
}

// Function to create a new order
async function insertOrder(ordersCollection, itemsCollection, customersCollection) 
{
    try 
    {
        // Prompt user for customer ID
        const customerId = await prompt('Input customer ID: ');

        // Check if the provided customer ID exists
        // New Object generated and uniqued, demonstrated in https://stackoverflow.com/questions/12211138/creating-custom-object-id-in-mongodb
        const customerExists = await customersCollection.findOne({ _id: new ObjectId(customerId) });
        if (!customerExists) 
        {
            console.log('Customer with the provided ID does not exist');
            return;
        }

        // Initialize items array
        const items = [];

        // Logic Prompt user for item IDs and quantities
        while (true) 
        {
            const itemId = await prompt('Input item ID (press Enter to finish): ');
            if (!itemId) break; // Exit loop if user presses Enter

            // Check if the provided item ID exists
            const itemExists = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
            if (!itemExists) 
            {
                console.log('Item with the provided ID does not exist');
                continue; // Prompt again if item ID doesn't exist
            }

            const quantity = parseInt(await prompt('Input quantity: '));
            if (isNaN(quantity) || quantity <= 0)
            {
                console.log('Invalid quantity. Quantity must be a positive number.');
                continue; // Prompt again if quantity is invalid
            }

            // Add item and quantity to items array
            items.push({ "Item_ID": new ObjectId(itemId), "Quantity": quantity });
        }

        // Create order document
        const order = {
            "Customer_ID": new ObjectId(customerId),
            "Items": items
        };

        await ordersCollection.insertOne(order);
        console.log('Order created successfully');
    } 
    catch (error) 
    {
        console.error('Error creating order:', error);
    }
}

// Function to retrieve a random order
// Function to retrieve a random order and log details
async function findOrder(ordersCollection) 
{
    const count = await ordersCollection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomOrder = await ordersCollection.findOne({}, { skip: randomIndex });

    console.log('Random Order:');
    console.log(`Customer ID: ${randomOrder.Customer_ID}`);
    console.log('Items:');
    randomOrder.Items.forEach((item, index) => {
        console.log(`  ${index + 1}. Item ID: ${item.Item_ID}, Quantity: ${item.Quantity}`);
    });
}

// Function to update an order with a random order ID
async function updateOrder(ordersCollection, itemsCollection, customersCollection) 
{
    try 
    {
        // Retrieve a random order
        const count = await ordersCollection.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomOrder = await ordersCollection.findOne({}, { skip: randomIndex });

        // Display current order details
        console.log('Current Order Details:', randomOrder);

        // Prompt user for updated customer ID
        const customerId = await prompt('Input updated customer ID: ');

        // Check if the provided customer ID exists
        const customerExists = await customersCollection.findOne({ _id: new ObjectId(customerId) });
        if (!customerExists) 
        {
            console.log('Customer with the provided ID does not exist');
            return;
        }

        // Initialize items array
        const items = [];

        // Logic Prompt user for item IDs and quantities
        while (true) 
        {
            const itemId = await prompt('Input updated item ID (press Enter to finish): ');
            if (!itemId) break; // Exit loop if user presses Enter

            // Check if the provided item ID exists
            const itemExists = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
            if (!itemExists) 
            {
                console.log('Item with the provided ID does not exist');
                continue; // Prompt again if item ID doesn't exist
            }

            const quantity = parseInt(await prompt('Input updated quantity: '));
            if (isNaN(quantity) || quantity <= 0) 
            {
                console.log('Invalid quantity. Quantity must be a positive number.');
                continue; // Prompt again if quantity is invalid
            }

            // Add item and quantity to items array
            items.push({ "Item_ID": new ObjectId(itemId), "Quantity": quantity });
        }

        // Update order data
        const updateData = {
            $set: {
                "Customer_ID": new ObjectId(customerId),
                "Items": items
            }
        };

        await ordersCollection.updateOne({ _id: randomOrder._id }, updateData);
        console.log('Order updated successfully');
    } 
    catch (error) 
    {
        console.error('Error updating order:', error);
    }
}

// Function to delete an order
async function deleteOrder(ordersCollection) 
{
    try 
    {
        // Prompt user for order ID to delete
        const orderId = await prompt('Input order ID to delete: ');

        // Check if the provided order ID exists
        const orderExists = await ordersCollection.findOne({ _id: new ObjectId(orderId) });;
        if (!orderExists) 
        {
            console.log('Order with the provided ID does not exist');
            return;
        }

        // Delete the order
        const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });
        console.log(`${result.deletedCount} order record deleted`);
    } 
    catch (error) 
    {
        console.error('Error deleting order:', error);
    }
}



// Function to prompt user for input, similarly shown in node.js file for Assignment-04. Demonstrated in https://nodejs.org/api/readline.html
function prompt(question) 
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}


// Run the main function
main().catch(console.error);

/*
Database Design:  
The three main collections in the database are items (phones), orders, and customers. It is organized using a relational framework. 
1. Client gathering maintains client data, such as addresses and personal information. 
2. The information about the available phones, including the price, model, and manufacturer, is stored in the phones collection.  
3. Order collection is a representation of customer orders. The customer ID, the products requested, and their quantities are all included in each order as they joint similarly in SQL
 
Impact on Code Development: Each entity's CRUD (Create, Read, Update, Delete) activities are reflected in the code structure (customers, phones, orders).  
Before carrying out actions, the code checks inputs and looks for the presence of relevant entities (such as the customer ID or item ID). This assures data integrity.  
The purpose of error handling is to detect and record any mistakes that could happen when using a database.
The program can handle many user requests simultaneously since non-blocking behavior is ensured by the usage of Promises and reactive methods. 
*/ 

// OS: Windows 11 Pro
// Browsers: Google Chrome and Microsoft Edge
// Browers' Versions: Chrome Version: Version 124.0.6367.61 (Official Build) (64-bit), Edge Version: Version 124.0.2478.51 (Official build) (64-bit)