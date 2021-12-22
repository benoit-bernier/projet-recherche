const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get_last_cobaye_id', function (req, res) {
  let nombre
  let files = fs.readdirSync(path.join(__dirname, 'data'))
  nombre = files.length
  res.send(((nombre === undefined || nombre === null) ? Math.floor(100000 + Math.random() * 900000) : nombre).toString()); // envoie le nombre de fichiers ou un nombre aléatoire à 6 chiffres
});

app.post('/', function requestHandler(req, res) {
  res.end('Hello, World!');
});

app.post('/save_data', function requestHandler(req, res) {
  console.log(req.body)
  let data = req.body
  fs.writeFileSync(path.join(__dirname, 'data', `${data.user_id}.json`), JSON.stringify(data))
  res.end(JSON.stringify({ ok: 200 }));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
