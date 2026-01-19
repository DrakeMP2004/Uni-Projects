import React, { useState, useEffect } from "react";
import "./styles.css"; //Import the CSS file for styling

//App Main Component
//First code blocks taken from Labs 3 and 4
function App() {
  const [exchangeRate, setExchangeRate] = useState(1); //Store exchange rate
  const [budget, setBudget] = useState(10); //Set default budget
  const [items, setItems] = useState([]); //Store item list
  const [catagorySelected, setSelectedCategory] = useState("Clothes"); //Store selected category for new items

  //Fetch items from exterrnal JSON file in the public folder
  useEffect(() => {
    fetch("/items.json") //Fetch data from external source
      .then((response) => response.json()) //Parse the response into JSON
      .then((data) => setItems(data)) //Set fetched items in state
      .catch((error) => console.error("Error loading saved items:", error)); //Handle any errors during fetching processs
  }, []);

  //Method to add new item
  const handleAddItem = () => {
    const name = document.getElementById("itemName").value; //Get item name from user input
    const price = parseFloat(document.getElementById("itemPrice").value); //Get item price from user input
    const newItem = {
      id: Date.now(), //Unique ID for new item based on current timestamp
      name,
      price,
      category: catagorySelected, //Utilise selected category for new item
    };
    setItems([...items, newItem]); //Add new item to the list
    //Clear input fields after adding item
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
  };

  //Function to delete an item by ID
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id)); //Remove the item from the list by ID
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Page Design Layout
  //"<input>" by react.dev
  //Guide by react.dev
  //Source: https://react.dev/reference/react-dom/components/input
  return (
    <div className="app">
      <h1 className="app-title styled-title">Shopping List Money Converter</h1>
      <CurrencyConverter onRateChange={setExchangeRate} />
      <div className="budget-container styled-box">
        <label>Input Your Budget:</label>
        <input
          type="number"
          className="budget-input styled-input"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))} //Update the budget when changed
        />
      </div>

      {/* Add Item Form */}
      <div className="add-item-form styled-box">
        {/* Form Title */}
        <h3>Add An Item to Your List</h3>

        {/* Input field for item name */}
        <input
          type="text"
          id="itemName"
          className="styled-input"
          placeholder="Item Name"
        />

        {/* Input field for item price */}
        <input
          type="number"
          id="itemPrice"
          className="styled-input"
          placeholder="Item Price"
        />

        {/* Category selection buttons */}
        <div className="category-tabs">
          {/* Button for choosing "Clothes" category */}
          <button
            className={`category-tab ${
              catagorySelected === "Clothes" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Clothes")}
          >
            Clothes
          </button>

          {/* Button for choosing "Tech" category */}
          <button
            className={`category-tab ${
              catagorySelected === "Tech" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Tech")}
          >
            Tech
          </button>

          {/* Button for choosing "Food" category */}
          <button
            className={`category-tab ${
              catagorySelected === "Food" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Food")}
          >
            Food
          </button>
        </div>

        {/* Add item button triggers handleAddItem function */}
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* List Component Shows list of items */}
      <ShopList
        items={items}
        exchangeRate={exchangeRate}
        onDeleteItem={handleDeleteItem}
      />

      {/* Total Cost Calculator Component Calculatess and shows the total */}
      <CosttTotalCalculator items={items} exchangeRate={exchangeRate} />

      {/* Budget Warning Component Displays warning if the budget exceeded */}
      <WarningBudget
        items={items}
        exchangeRate={exchangeRate}
        budget={budget}
      />
    </div>
  );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CurrencyConverter Component
//Set up the useState variables
function CurrencyConverter({ onRateChange }) {
  const [currencies, setCurrencies] = useState([]); //Store available currencies
  const [baseCur, setBaseCur] = useState("USD"); //Set default base currency to USD (US Dollars)
  const [targetCur, setTargetCur] = useState("EUR"); //Set default target currency to EUR (Euros)
  const [rate, setRate] = useState(1); //Set default exchange rate to 1

  //Fetch exchange rates when target changes

  //"What is an API & how to fetch it in React with Hooks" by Vaibhav Khulbe
  //Code parrt taken by Vaibhav Khulbe
  //Source:https://dev.to/vaibhavkhulbe/what-is-an-api-how-to-fetch-it-in-react-with-hooks-2528

  //Fetched and Authenticated from ExchangeRate-API by AYR Tech (Pty) Ltd
  //Source: https://www.exchangerate-api.com/docs/authentication

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD") //Fetch exchange rates from API
      .then((response) => response.json()) //Convert the response to JSON
      .then((data) => {
        setCurrencies(Object.keys(data.rates)); //Set available currencies
        setRate(data.rates[targetCur]); //Set the rate for the selected target currency
      });
  }, [targetCur]); //Effect depends on the target currency

  //Update the exchange rate whenever the rate changes
  useEffect(() => {
    onRateChange(rate); //Notify parent component of the exchange rate change
  }, [rate, onRateChange]); //This effect depends on the rate

  //"A simple currency converter in React does not update when the currency is changed" by mrcrazyog
  //Q&A Code Layout Test by mrcrazyog
  //Source: https://stackoverflow.com/questions/75384059/a-simple-currency-converter-in-react-does-not-update-when-the-currency-is-change

  //"Build A Currency Converter in React JS | Best Beginner React JS Proje" by CodingNepal
  //App example by CodingNepal
  //Source: https://www.codingnepalweb.com/build-currency-converter-project-reactjs/

  //"<option>" by react.dev
  //Guide by react.dev
  //Source: https://react.dev/reference/react-dom/components/option

  return (
    <div className="currency-converter styled-box">
      <h2>Currency Converter</h2>

      <label>Select Base Currency:</label>
      <select
        className="styled-select"
        value={baseCur}
        onChange={(e) => setBaseCur(e.target.value)} //Update base currency when selected
      >
        {/* Map and Key layouts taken from my Lab 4 Part 3 app code */}
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>

      <label>Select Target Currency:</label>
      <select
        className="styled-select"
        value={targetCur}
        onChange={(e) => setTargetCur(e.target.value)} //Update targett currency when selected
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>

      <p className="styled-text">
        Aprox. Exchange Rate: <span>{rate}</span>{" "}
        {/* Show the current exchange rate */}
      </p>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ShopList Component
function ShopList({ items, exchangeRate, onDeleteItem }) {
  const [filterItems, setfilterItems] = useState(items); //Store filtered items chose on category

  //
  //Filter items by category from conditional rendering
  const handleFilter = (category) => {
    setfilterItems(
      category === "all"
        ? items
        : items.filter((item) => item.category === category) //Only reveal items from chosen category
    );
  };

  //Price Sort Items
  const handleSort = (type) => {
    const sortIItems = [...filterItems]; //Make copy of filtered items
    if (type === "priceAsc") {
      sortIItems.sort((x, y) => x.price - y.price); //Sort by price ascendinglyy
    } else if (type === "priceDesc") {
      sortIItems.sort((x, y) => y.price - x.price); //Sort by price descendingly
    }
    setfilterItems(sortIItems); //Update filtered items
  };

  //"How to sort and filter data in React & TypeScript" by thecodingloft
  //Typescript App example by thecodingloft. Layout taken and Converted to JavaScript by CodeConvert.Ai and ChatGPT with variable and condition changes
  //Source: https://gist.github.com/thecodingloft/4e621092495de405f342dad209f8b0bb
  return (
    <div className="shopping-list styled-box">
      <h2>Shopping List</h2>
      <label>Filter by category:</label>
      <select
        className="styled-select"
        onChange={(e) => handleFilter(e.target.value)} //Filter items when category is changed
      >
        <option value="all">All</option>
        {[...new Set(items.map((item) => item.category))].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label>Sort by price:</label>
      <select
        className="styled-select"
        onChange={(e) => handleSort(e.target.value)} //Sort items when sort option changed
      >
        <option value="none">None</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>

      <ul className="styled-list">
        {filterItems.map((item) => (
          <li key={item.id} className="styled-list-item">
            {item.name}:{" "}
            <span className="price styled-highlight">
              {(item.price * exchangeRate).toFixed(2)}{" "}
              {/* Convert price to selected currency */}
            </span>
            <button
              className="delete-button"
              onClick={() => onDeleteItem(item.id)} //Remove item when button clicked
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//WarningBudget Component
function WarningBudget({ items, exchangeRate, budget }) {
  const total = items.reduce((sum, item) => sum + item.price, 0) * exchangeRate; //Get total cost of items of listt

  //Conditional Rendering of the price for warn
  return (
    <div
      className={`budget-warning styled-box ${
        total > budget ? "warning-box" : "success-box"
      }`}
    >
      {total > budget ? (
        <p className="warning">Warning: Total cost goes above your budget!</p> //Show warning if total exceeds budget
      ) : (
        <p className="success">You are within budget.</p> //Show success if within budget
      )}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

//CostTotalCalculator Component
//"add the values in a list and display total price react js" by vivek kn
//StackOverflow Code Q&A by vivek kn
//Source: https://stackoverflow.com/questions/73917613/add-the-values-in-a-list-and-display-total-price-react-js
function CosttTotalCalculator({ items, exchangeRate }) {
  const total = items.reduce((sum, item) => sum + item.price, 0) * exchangeRate; //Calculate total cost in selected currency

  return (
    <div className="total-calculator styled-box">
      <h2>Total</h2>
      <p>
        Total Cost of Items:{" "}
        <span className="total styled-highlight">{total.toFixed(2)}</span>{" "}
        {/* Display the total */}
      </p>
    </div>
  );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default App;
