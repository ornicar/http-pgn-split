// node server.js <port> <source> <delay>
// node server.js 9999 http://54.194.223.217/batumiolympiad2018/live/open-03.pgn 3
const express = require('express')
const request = require('request');

const port = parseInt(process.argv[2]);
const source = process.argv[3];
const delay = parseInt(process.argv[4]);
const separator = '\n\n\n';

let chunks = [];

function getFullPgn() {
  request(source, (err, res, body) => {
    chunks = makeChunks(body);
    console.log(`Made ${chunks.length} chunks of ${chunks.map(c => c.length).join(', ')} games.`);
    scheduleGetFullPgn();
  });
}

function scheduleGetFullPgn() {
  setTimeout(getFullPgn, delay * 1000);
}

function makeChunks(full) {
  const games = full.split(separator).filter(g => !!g);
  return chunkArray(games, 64);
}

function chunkArray(arr, size){
  let results = [];
  while (arr.length) results.push(arr.splice(0, size));
  return results;
}

const app = express()
app.get('/chunk/:id', function (req, res) {
  const chunkId = parseInt(req.params.id) - 1;
  const games = chunks[chunkId];
  if (games) res.send(games.join(separator));
  else res.status(404).end();
})
app.listen(port, function () {
  console.log(`Server is listening on http://127.0.0.1/${port}/chunk/1`);
})
getFullPgn();
