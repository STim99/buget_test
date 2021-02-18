import express from 'express'
import formidable from 'formidable'
import dbService from './dbServise.js'

const PORT = process.env.PORT || 3000

const app = express()

function parseBody(req, res, next) {
    formidable().parse(req, (err, body) => {
        if (err) {
            console.log(err)
            return
        }
        req.body = body
        return next()
    })
}
const db = new dbService();

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/addAccount', parseBody, (req, res) => {
    db.addAccount(req.body.name, req.body.value)
        .then(data => res.json(data))
        .catch(err => console.log(err))
})

app.get('/getAccount/:id', (req, res) => {
    db.getAccountFromId(req.params.id)
        .then(data => res.json(data))
        .catch(err => console.log(err));
})

app.get('/getAllAccount', (req, res) => {
    db.getAllAccount()
        .then(data => res.json(data))
        .catch(err => console.log(err));
})

app.get('/getAllTransactionFromId/:id', (req, res) => {
    db.getAllTransactionFromId(req.params.id)
        .then(data => res.json(data))
        .catch(err => console.log(err));
})

app.post('/transaction', parseBody, (req, res) => {
    db.addTransaction(req.body.account_id, req.body.value)
        .then(data => res.json(data))
        .catch(err => res.send('Transaction rejected'));
})

app.listen(PORT, () => {
    console.log(`running on port:${PORT}`)
})
