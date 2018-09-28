// run server:
// node server.js <port> <source> <delay>
// node server.js 9999 http://54.194.223.217/batumiolympiad2018/live/open-03.pgn 3

// request games:
// GET /<nbPerChunk>/<chunkId>.pgn
// GET /64/1.pgn
// GET /64/2.pgn

const express = require('express')
const request = require('request');

const port = parseInt(process.argv[2]);
const source = process.argv[3];
const delay = parseInt(process.argv[4]);
const separator = '\n\n\n';

let allGames = [];

function getFullPgn() {
  request(source, (err, res, body) => {
    allGames = body.split(separator).filter(g => !!g);
    console.log(`Got ${allGames.length} games (${body.length} bytes)`);
    setTimeout(getFullPgn, delay * 1000);
  });
}
getFullPgn();

const app = express()
app.get('/:nbPerChunk/:chunkId.pgn', function (req, res) {
  const nbPerChunk = parseInt(req.params.nbPerChunk);
  const chunkId = parseInt(req.params.chunkId) - 1;
  const games = allGames.slice(chunkId * nbPerChunk, (chunkId + 1) * nbPerChunk);
  if (games.length) res.send(games.join(separator));
  else res.status(404).end();
})
app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
})
