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

const updateClientViewChoices = (game) => {
  setTimeout( () => {
    game.player1Socket.emit("game.choices.view-state", GameService.send.forPlayer.choicesViewState('player:1', game.gameState))
    game.player2Socket.emit("game.choices.view-state", GameService.send.forPlayer.choicesViewState('player:2', game.gameState))
  }, 400)
}

const viewDeckStateBothPlayers = (game) => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1',game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2',game.gameState));
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
  // combinations management
  const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
  const dices = { ...games[gameIndex].gameState.deck.dices};
  const isDefi = false;
  const isSec = games[gameIndex].gameState.deck.rollsCounter === 2;
  const combinations = GameService.choices.findCombinations(dices, isDefi, isSec);


  // we affect changes to gameState
  games[gameIndex].gameState.choices.availableChoices = combinations;
// emitters

  games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices)
  games[gameIndex].gameState.deck.rollsCounter++;

    if(games[gameIndex].gameState.deck.rollsCounter > games[gameIndex].gameState.deck.rollsMaximum) {
      games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.timer = 5;
      updateClientViewChoices(games[gameIndex])
    }

    updateClientViewChoices(games[gameIndex]);
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
      games[gameIndex].gameState.choices = GameService.init.choices();

      viewDeckStateBothPlayers(games[gameIndex])
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

const lockDices = (idDice, socketId) => {
  const gameIndex = GameService.utils.findGameIndexBySocketId(games, socketId)
  const diceIndex = GameService.utils.findDiceIndexByDiceId(games[gameIndex].gameState.deck.dices, idDice)

  console.log(games[gameIndex].gameState.deck.dices[diceIndex].locked)
  games[gameIndex].gameState.deck.dices[diceIndex].locked = !games[gameIndex].gameState.deck.dices[diceIndex].locked
  viewDeckStateBothPlayers(games[gameIndex])
}

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
  socket.on('game.dices.lock', (idDice) => {
    lockDices(idDice, socket.id)
  })
  socket.on('game.choices.selected', (data) => {
    // gestion des choix
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    games[gameIndex].gameState.choices.idSelectedChoice = data.choiceId;
    updateClientViewChoices(games[gameIndex]);
  });
  socket.on('game.grid.selected', (data) => {

    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    
    // La sélection d'une cellule signifie la fin du tour (ou plus tard le check des conditions de victoires)
    // On reset l'état des cases qui étaient précédemment clicables.
    games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);
    games[gameIndex].gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, games[gameIndex].gameState.currentTurn, games[gameIndex].gameState.grid);
  
    // TODO: Ici calculer le score
    const score = GameService.grid.calculateScore(games[gameIndex].gameState.grid);
    console.log(`Score: ${score}`);

    // TODO: Puis check si la partie s'arrête (lines / diagolales / no-more-gametokens)
    const isGameOver = GameService.grid.checkGameOver(games[gameIndex].gameState.grid);
    if (isGameOver) {
      // Game over logic here
      console.log("Game over!");
    } else {
      // Continue the game logic here
      console.log("Continue the game...");
    }
  
    // Sinon on finit le tour
    games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
    games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
  
    // On remet le deck et les choix à zéro (la grille, elle, ne change pas)
    games[gameIndex].gameState.deck = GameService.init.deck();
    games[gameIndex].gameState.choices = GameService.init.choices();
  
    // On reset le timer
    games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
    games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));
  
    // et on remet à jour la vue
    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoices(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });
  
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------
app.get('/', (req, res) => res.sendFile('index.html'));
http.listen(3000, function(){ console.log('listening on *:3000');
});