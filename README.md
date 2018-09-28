Split big PGN sources into multiple URLs, for use with lichess broadcasts.


### run server:
    node server.js <port> <source> <delay>
    node server.js 9999 http://54.194.223.217/batumiolympiad2018/live/open-03.pgn 3

### request games:
    GET /<nbPerChunk>/<chunkId>.pgn
    GET /64/1.pgn
