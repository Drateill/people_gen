import './App.css';
import { useEffect, useState } from 'react';

const faker = require('faker');
faker.locale = "fr";

function App() {

  const [number, setNumber] = useState(0);
  const [peopleList, setPeopleList] = useState([]);
  const [FilteredpeopleList, setFilteredPeopleList] = useState([]);


  //Create array of objects
  //Function to generade random people
  const people = [];
  function generatePeople(number) {
  for (var i = 0; i < number; i++) {
    var cards = [];
    var id = i;
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var streetName = faker.address.streetName();
    var city = faker.address.cityName();
    var streetNumber = Math.floor(Math.random() * (999 - 1) + 1);
    var zipCode = faker.address.zipCode();
    var birthDate = faker.date.past().toDateString();
    var phoneNumber = faker.phone.phoneNumber();

    for (var j = 0; j< Math.floor(Math.random() * 2) + 1; j++) {
      var cardNumber = faker.finance.creditCardNumber();
      //50% chance of having type as visa card and 50% chance of type as mastercard
      var cardType = Math.floor(Math.random() * 2) === 0 ? 'Visa' : 'Mastercard';
      var cardExpiry = faker.date.future().toDateString();
      var cardCVV = faker.finance.creditCardCVV();

      cards.push({
        cardNumber: cardNumber,
        cardType: cardType,
        cardExpiry: cardExpiry,
        cardCVV: cardCVV
    })};

    people.push({
      id: id,
      firstName: firstName,
      lastName: lastName,
      streetName: streetName,
      city: city,
      streetNumber: streetNumber,
      zipCode: zipCode,
      birthDate: birthDate,
      phoneNumber: phoneNumber,
      cards: cards,
      transactions: createTransaction()

    });
    setPeopleList(people);
    setFilteredPeopleList(people);
    
  }
}
console.log(FilteredpeopleList);
//Create transaction array

function createTransaction(){
  const transactions = [];
    for (var i = 0; i < Math.floor(Math.random() * (25 - 1) + 1); i++) {
    var id = i;
    var transactionDate = faker.date.past().toDateString();
    var transactionAmount = Math.floor(Math.random() * (999 - 5) + 5);
    var transactionType = Math.floor(Math.random() * 2) === 0 ? 'debit' : 'credit';
    var transactionDescription = faker.finance.transactionDescription();

    transactions.push({
      id: id,
      transactionDate: transactionDate,
      transactionAmount: transactionAmount,
      transactionType: transactionType,
      transactionDescription: transactionDescription
    });
    
  }
  return transactions
}




//filter people by zipcode starting by the input
function filterPeople(zipCode) {
  var filteredPeople = peopleList.filter(function(person) {
    return person.zipCode.startsWith(zipCode);
  });
  setFilteredPeopleList(filteredPeople);
}


 
const handleSaveToPC = (people) => {
  const fileName = 'people.json';
  const fileType = 'application/json';
  const fileContent = JSON.stringify(people);
  const blob = new Blob([fileContent], { type: fileType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

const handleNumberChange = (event) => {
  setNumber(event);
}

//update the state of the number of people
useEffect(() => {
  generatePeople(number);
  setPeopleList(people);
}, [number]);

  return (
    <div className="App">
      {/* Create a card for each people */}
      {/* handleSaveToPC Button */}
      <div className="App-header">
      <input type="number" placeholder="Number of people" onChange={(e) => handleNumberChange(e.target.value)}/>
      {/* Input filter by zipcode */}
      <input type="text" placeholder="Filter by zipcode" onChange={(e) => filterPeople(e.target.value)}/>
      <button onClick={() => handleSaveToPC(FilteredpeopleList)}>Save to PC</button>
      </div>
      {FilteredpeopleList.map(person => (
        <div className="card" key={person.id}>
          <div className="card-header">
            <h3>{person.firstName} {person.lastName}</h3>
          </div>
          <div className="card-body">
            <p>{person.streetNumber} {faker.address.streetPrefix()} {person.streetName} </p>
            <p>Ville : {person.city}</p>
            <p>Zipcode : {person.zipCode}</p>
            <p>{person.birthDate}</p>
            <p>{person.phoneNumber}</p>
            <p>{person.cards.map(card => (
              <div className="card-body" key={card.cardCVV}>
                <p>{card.cardType} : {card.cardNumber}</p>
                <p>Expire : {card.cardExpiry}</p>  
                <p>Cryptograme : {card.cardCVV}</p>
              </div>
            ))}</p>

            </div>

          </div>))}
    </div>
  );
}

export default App;
