const express = require("express")
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv')

//configure environment variables
dotenv.config();

//create a connection object

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//test db conncection

db.connect((err) => {
    //  connection is not successful
    if(err) return console.log("Error connecting to the database", err);

    //connection was successful
    console.log("Connected to database as id: ", db.threadId); 
}) 

// Question 1: retrieve all patients - http://localhost:3000/patients
app.get('/patients', (req, res)=>{
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients, (err, data) => {
      if(err) {
        return res.status(400).send("Failed to get Patients", err)
      }
res.status(200).send(data)

})
})

// Question 2: Retrieve all providers http://localhost:3000/providers

app.get('/providers', (req, res)=>{
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers"
    db.query(getProviders, (err, data) => {
      if(err) {
        return res.status(400).send("Failed to get Providers", err)
      }
res.status(200).send(data)

})
})

//Question 3:Filter patients by First Name :http://localhost:3000/fnamepatients

app.get('/fnamepatients', (req, res)=>{
    const getPatients = "SELECT first_name FROM patients"
    db.query(getPatients, (err, data) => {
      if(err) {
        return res.status(400).send("Failed to get  the first name of Patients", err)
      }
res.status(200).send(data)

})
})
  
// Question 4: Retrieve all providers by their specialty http://localhost:3000/providerspecialty?specialty=Cardiology

app.get('/providerspecialty', (req, res) => {
    const specialty = req.query.specialty;  // Assuming the specialty is passed as a query parameter
    const getProvidersBySpecialty = "SELECT provider_id, first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
    
    db.query(getProvidersBySpecialty, [specialty], (err, data) => {
      if (err) {
        return res.status(400).send({ error: "Failed to get providers", details: err.message });
      }
      res.status(200).send(data);
    });
  });
  
  
  
//start and listen to server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})

