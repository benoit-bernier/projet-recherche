const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get_last_cobaye_id', function (req, res) {
  res.send("42");
});

app.post('/', function requestHandler(req, res) {
  res.end('Hello, World!');
});

app.post('/save_data', function requestHandler(req, res) {
  console.log(req.body)
  //TODO : enregistrer tout ça dans un fichier
  res.end(JSON.stringify({ok:200}));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
