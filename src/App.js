import './App.css';
import { useEffect, useState } from 'react';

const faker = require('faker');
faker.locale = "fr";

function App() {

  const [number, setNumber] = useState(0);
  const [peopleList, setPeopleList] = useState([]);
  const [transaction, setTransaction] = useState(false);
  const [card, setCard] = useState(false);

  //Function to generade random people
  const people = [];
  async function generatePeople(number) {
  for (var i = 0; i < number; i++) {
    var cards = [];
    var zipCode=faker.address.zipCode();
    var id = i;
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var streetName = faker.address.streetName();
    var streetNumber = Math.floor(Math.random() * (999 - 1) + 1);
    var city = faker.address.cityName();


    const result = await fetch(`https://vicopo.selfbuild.fr/ville/${city}`);
    const data = await result.json();
    //If data is not empty, set the state 
    if (data.cities.length !==0){
      zipCode=data.cities[0].code;
    }
    
    var birthDate = faker.date.past().toDateString();
    var phoneNumber = faker.phone.phoneNumber();

    if(card){
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
    }



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
      transactions: transaction ? createTransaction() : null

    });
  }
  setPeopleList(people);
}
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

//function to export people list to csv file in utf-8 format
const handleExportToCSV = (people) => {
  const fileName = 'people.csv';
  const fileType = 'text/csv;charset=UTF-8';
  const fileContent = people.map(person => {
    return {
      firstName: person.firstName,
      lastName: person.lastName,
      streetName: person.streetName,
      city: person.city,
      streetNumber: person.streetNumber,
      zipCode: person.zipCode,
      birthDate: person.birthDate,
      phoneNumber: person.phoneNumber,
      cards: person.cards.map(card => {
        return {
          cardNumber: card.cardNumber,
          cardType: card.cardType,
          cardExpiry: card.cardExpiry,
          cardCVV: card.cardCVV
        }
      }),
      transactions: transaction? person.transactions.map(transaction => {
        return {
          transactionDate: transaction.transactionDate,
          transactionAmount: transaction.transactionAmount,
          transactionType: transaction.transactionType,
          transactionDescription: transaction.transactionDescription
        }
      }) : null
    }
  }
  )
  const fileContentString = fileContent.map(person => {
    return [
      person.firstName,
      person.lastName,
      person.streetName,
      person.city,
      person.streetNumber,
      person.zipCode,
      person.birthDate,
      person.phoneNumber,
      card ? person.cards.map(card => {
        return `${card.cardNumber}, ${card.cardType}, ${card.cardExpiry}, ${card.cardCVV}`
      }): null,
      transaction ? person.transactions.map(transaction => {
        return `${transaction.transactionDate}, ${transaction.transactionAmount}, ${transaction.transactionType}, ${transaction.transactionDescription}`
      }) : null
    ].join(',');
  }
  ).join('\n');
  const blob = new Blob([fileContentString], { type: fileType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  console.log("fileContent: ", fileContent)
  console.log("fileContentString: ", fileContentString)
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}


    

//function to Show/hide modal
const [showModal, setShowModal] = useState(false);
const [showCard, setShowCard] = useState(false);

const handleModal = () => setShowModal(!showModal);
const handleCard = () => setShowCard(!showCard);

  return (
    <div className="App">
      {/* Create a card for each people */}
      {/* handleSaveToPC Button */}
      <div className="App-header">
      <input type="number" placeholder="Number of people" onChange={(e) => handleNumberChange(e.target.value)}/>
      {/* Checkbox for transaction generation */}
      <input type="checkbox" id="transaction" onClick={() => setTransaction(!transaction)}/> Transactions ? 
      {/* Checkbox for card generation */}
      <input type="checkbox" id="card" onClick={() => setCard(!card)}/> Card ?
      <button onClick={() => generatePeople(number)}>Generate</button>
      <button onClick={() => handleExportToCSV(peopleList)}>Save to PC in CSV</button>
      <button onClick={() => handleSaveToPC(peopleList)}>Save to PC in Json</button>

      </div>
      {peopleList.map(person => (
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
            <button onClick={() => handleCard(person)}>Cartes</button>
            <p>{person.cards.map(card => (
              <div className="card-body" style={{display : showCard ? "block" : "none"}}  key={card.cardCVV}>
                <p>{card.cardType} : {card.cardNumber}</p>
                <p>Expire : {card.cardExpiry}</p>  
                <p>Cryptograme : {card.cardCVV}</p>
              </div>
            ))}</p>
{/* Button handleModal */}
            <button onClick={() => handleModal(person)}>Transactions</button>
            </div>
            
              {/* Create a modal to show transactions */}
              <div className="modal" style={{display : showModal ? "block" : "none"}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Transactions</h3>
                  </div>
                  <div className="modal-body">
                    {transaction ? person.transactions.map(transaction => (
                      <div className="card-body" key={transaction.id}>
                        <p>Date : {transaction.transactionDate}</p>
                        <p>Montant : {transaction.transactionAmount}</p>
                        <p>Type : {transaction.transactionType}</p>
                        <p>Description : {transaction.transactionDescription}</p>
                      </div>
                    )): null}
                  </div>
                </div>
              </div>
          </div>))}
    </div>
  );
}

export default App;
