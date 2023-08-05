const express = require('express')
const app = express()
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient
const url = "mongodb+srv://guruprakash745:qcU308yFCSBgowJW@cluster0.pxswliq.mongodb.net/GuruDatabase?retryWrites=true&w=majority";


app.use(express.json())

const allowedOrigins = ['https://node-server-simple-v7rm.onrender.com'];
app.use(cors({
  origin: allowedOrigins
}));

mongoClient.connect(url, (err, db) => {

    if (err) {
        console.log("Error while connecting mongo client")
    } else {

        const myDb = db.db('GuruDatabase')
        const collection = myDb.collection('users')

        app.get('/', (req, res) => {
            res.send('Hello, this is the root of the server!');
        });

        app.post('/signup', (req, res) => {

            const newUser = {
               
                email: req.body.email,
                password: req.body.password
            }

            const query = { email: newUser.email }

            collection.findOne(query, (err, result) => {

                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        res.status(200).send()
                    })
                } else {
                    res.status(400).send()
                }

            })

        })

        app.post('/login', (req, res) => {

            const query = {
                email: req.body.email,
                password: req.body.password
            }

            collection.findOne(query, (err, result) => {

                if (result != null) {

                    const objToSend = {
                        email: result.email
                    }

                    res.status(200).send(JSON.stringify(objToSend))

                } else {
                    res.status(404).send()
                }

            })

        })

    }

})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})