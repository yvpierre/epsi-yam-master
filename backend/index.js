const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');
// --------------------------------------------------- // -------- CONSTANTS AND GLOBAL VARIABLES ----------- // ---------------------------------------------------
let games = [];
let queue = [];
// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------
const updateClientViewTimers = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
    game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
  }, 400)
}

const viewDeckStateBothPlayers = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1',game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2',game.gameState));
  }, 400)
}
const newPlayerInQueue = (socket) => {
  queue.push(socket);
  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};
const ejectPlayerFromQueue = (socket) => {
  queue.slice(queue.indexOf((elem) => elem.id === socket.id))
  socket.emit('queue.eject', GameService.send.forPlayer.viewQueueState())
}
const ff = (socket) => {
  games.slice(games.indexOf((elem) => elem.id === socket.id))
}

const rollDices = (socket) => {
  const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
  // Pour les deux premiers lancers
  games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices)
  games[gameIndex].gameState.deck.rollsCounter++;

  if(games[gameIndex].gameState.deck.rollsCounter === games[gameIndex].gameState.deck.rollsMaximum) {
    games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(games[gameIndex]);
    games[gameIndex].gameState.timer = 5;
  }
  viewDeckStateBothPlayers(games[gameIndex])
}

const createGame = (player1Socket, player2Socket) => {
  const newGame = GameService.init.gameState();
  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  games.push(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;

    // Si le timer tombe à zéro
    if (games[gameIndex].gameState.timer === 0) {
      // On change de tour en inversant le clé dans 'currentTurn'
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
      // Méthode du service qui renvoie la constante 'TURN_DURATION'
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      games[gameIndex].gameState.deck = GameService.init.deck()
      viewGameStateBothPlayers(games[gameIndex])
    }
    updateClientViewTimers(games[gameIndex])
  }, 1000);

  // Emissions

  // START GAME
  games[gameIndex].player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]))
  games[gameIndex].player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]))

  viewDeckStateBothPlayers(games[gameIndex])


  // On prévoit de couper l'horloge
  // pour le moment uniquement quand le socket se déconnecte
  player1Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });
  player2Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

};
// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------
io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);
  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });
  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
  socket.on('queue.leave', () => {
    console.log(`[${socket.id}] player ejected from the queue `)
    ejectPlayerFromQueue(socket);
  })
  socket.on('queue.ff', () => {
    // TBD
  })
  socket.on('game.dices.roll', () => {
    console.log(`[${socket.id}] dices rolled`)
    rollDices(socket);
  });

});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------
app.get('/', (req, res) => res.sendFile('index.html'));
http.listen(3000, function(){ console.log('listening on *:3000');
});