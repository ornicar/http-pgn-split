
const express = require('express');
const request = require('request');

const port = parseInt(process.argv[2]);
const source = process.argv[3];
const delay = parseInt(process.argv[4]);
const separator = '\n\n[';

let allGames = [];

function getFullPgn() {
  request(source, (err, res, body) => {
    if (body && !err) {
      allGames = body.split(separator).filter(g => !!g);
      console.log(`Got ${allGames.length} games (${body.length} bytes)`);
    } else if (!body) {
      console.log(`Empty response`);
    } else {
      console.log(`ERROR ${res.statusCode} err:${err}`);
    }
    setTimeout(getFullPgn, delay * 1000);
  });
}
getFullPgn();

const app = express();
app.get('/:fromGameId/:toGameId.pgn', function (req, res) {
  const fromGameId = parseInt(req.params.fromGameId) - 1;
  const toGameId = parseInt(req.params.toGameId) - 1;
  const games = allGames.slice(fromGameId, toGameId + 1);
  if (games.length) res.send(games.join(separator));
  else res.status(404).end();
})
app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
})
