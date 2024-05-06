// websocket-server/services/game.service.js
const TURN_DURATION = 45;
const NB_PIONS = 3;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        grid: [],
        choices: {},
        deck: {},
        player1Puns: NB_PIONS,
        player2Puns: NB_PIONS,
    }
}

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
    // Quand un choix est déjà marqué deux fois sur la grille, sauf pour le yam (1 fois suffit)
    notAvailableChoices : [],
};

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];


const ALL_COMBINATIONS = [
    { value: 'Brelan (1)', id: 'brelan1' },
    { value: 'Brelan (2)', id: 'brelan2' },
    { value: 'Brelan (3)', id: 'brelan3' },
    { value: 'Brelan (4)', id: 'brelan4' },
    { value: 'Brelan (5)', id: 'brelan5' },
    { value: 'Brelan (6)', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];



const GameService = {
    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [ ...GRID_INIT];
            return game;
        },
        deck: () => {
            return { ...DECK_INIT };
        },
        choices: () => {
            return { ...CHOICES_INIT };
        },

        grid: () => {
            return { ...GRID_INIT };
        }
    },
    timer: {
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },
    send: {
        forPlayer: {
            // Return conditionnaly gameState custom objet for player views
            viewGameState: (playerKey, game) => { return {
                inQueue: false,
                inGame: true,
                idPlayer:
                    (playerKey === 'player:1')
                        ? game.player1Socket.id
                        : game.player2Socket.id,
                idOpponent:
                    (playerKey === 'player:1')
                        ? game.player2Socket.id
                        : game.player1Socket.id
            }; },
            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },
            gameTimer: (playerKey, gameState) => {
                // Selon la clé du joueur on adapte la réponse (player / opponent)
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return {
                    playerTimer: playerTimer,
                    opponentTimer: opponentTimer
                };
            },
            deckViewState: (playerKey, gameState) => {
                return {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
            },
            choicesViewState: (playerKey, gameState) => {
                return {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                };
            },
            gridViewState: (playerKey, gameState) => {
                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };
            },
            scoreViewState: (playerKey, gameState) => {
                const playerScore = playerKey === 'player:1' ? gameState.player1Score : gameState.player2Score;
                const opponentScore = playerKey === 'player:1' ? gameState.player2Score : gameState.player1Score;
                return {
                    playerScore: playerScore,
                    opponentScore: opponentScore
                };
            },
            gameEndReview: (playerKey, gameState) => {
                let playerMessage = ""
                let opponentMessage  = ""
                let gameDetails = ""
                let playerWin = false

                if(playerKey === 'player:1'){
                    if(gameState.player1Score >=1000 || gameState.player2Puns === 0) {
                        playerMessage = "Félicitations pour cette belle victoire"
                        if(gameState.player1Score >= 1000) {
                            gameDetails = "Écrasante victoire de PLAYER 1 avec un score de "+gameState.player1Score+" à "+gameState.player2Score
                        } else {
                            gameDetails = "Victoire pour cause de manque de pions de PLAYER 2 ! on va pas cracher dans la soupe"
                        }
                        playerWin = true
                    } else {
                        playerMessage = "Pas dingue... défaite"
                        if(gameState.player2Score >= 1000) {
                            gameDetails = "Victoire de PLAYER 2 avec un score de "+gameState.player2Score+" à "+gameState.player1Score
                        } else if (gameState.player1Puns === 0) {
                            gameDetails = "Manque de pions de PLAYER 1 ! on va pas cracher dans la soupe"
                        }
                        playerWin = false
                    }
                } else {
                    if(gameState.player2Score >=1000 || gameState.player1Puns === 0) {
                        playerMessage = "Fantastique victoire"
                        if(gameState.player2Score >= 1000) {
                            gameDetails = "Victoire de PLAYER 2 avec un score de "+gameState.player2Score+" à "+gameState.player1Score
                        } else {
                            gameDetails = "Manque de pions de PLAYER 1 ! on va pas cracher dans la soupe"
                        }
                        playerWin = true
                    } else {
                        playerMessage = "Défaite de merde"
                        if(gameState.player1Score >= 1000) {
                            gameDetails = "Victoire de PLAYER 1 avec un score de "+gameState.player1Score+" à "+gameState.player2Score
                        } else {
                            gameDetails = "Manque de pions de PLAYER 2 ! on va pas cracher dans la soupe"
                        }
                        playerWin = false
                    }
                }

                console.log("gameDetails"+gameDetails)

                return {
                  isOver: true,
                  playerMessage: playerMessage,
                  playerWin: playerWin,
                  gameDetails: gameDetails
                }
            },
        }
    },
    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            const allCombinations = ALL_COMBINATIONS;
            const availableCombinations = [];
            const counts = Array(7).fill(0);
            let des = Object.values(dices);

            des.forEach((de) => {
                counts[de.value - 1]++;
            });

            // brelan
            let threeOfAKindValue = counts.findIndex(x => x >= 3) + 1;
            let hasThreeOfAKind = counts.some((x) => x >= 3);
            // carreee
            let hasFourOfAKind = counts.some((x) => x >= 4)
            // yams bordel
            let hasFiveOfAKind = counts.some((x) => x >= 5);
            // full
            let hasFull = counts.includes(2) && counts.includes(3);
            // suite
            // on rajoute le OU || derrière pour vérifier que la suite à bien le premier ou le dernier index vide
            let hasStraight = (!counts.find((x) => x > 1)) && (counts[0] === 0 || counts[counts.length-1] === 0);
            // total
            let sum = 0
            counts.map((elem, index) => {
                sum+= elem*(index+1);
            });
            // moins 2 huit
            let isLessThanEqual8 = sum <= 8;


            if (hasThreeOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "brelan"+threeOfAKindValue))
            if (hasFourOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "carre"));
            if (hasFiveOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "yam"));
            if (hasFull) availableCombinations.push(allCombinations.find(comb => comb.id === "full"))
            if (hasStraight) availableCombinations.push(allCombinations.find(comb => comb.id === "suite"))
            if (isLessThanEqual8) availableCombinations.push(allCombinations.find(comb => comb.id === "moinshuit"))

            if(isSec && availableCombinations.length >= 1) availableCombinations.push(allCombinations.find(comb => comb.id === "sec"))


            return availableCombinations;
        }
    },

    // Returns en inlines suite a des suggestions de Webstorm
    grid: {
        resetcanBeCheckedCells: (grid) => {
            return grid.map(row => row.map(cell => {
                return {...cell, canBeChecked: false};
            }));
        },

        updateGridAfterSelectingChoice: (choices, grid) => {
            return grid.map(row => row.map(cell => {
                if (choices.some((elem) => elem.id === cell.id) && cell.owner === null) {
                    return {...cell, canBeChecked: true};
                } else {
                    return cell;
                }
            }));
        },

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            return grid.map((row, rowIndexParsing) => row.map((cell, cellIndexParsing) => {
                if ((cell.id === idCell) && (rowIndexParsing === rowIndex) && (cellIndexParsing === cellIndex)) {
                    return {...cell, owner: currentTurn};
                } else {
                    return cell;
                }
            }));
        },
        calculateScore: (grid) => {
            /*
            Bon j'ai au final craqué et utilisé chatgpt pour fixer mon algo bancal mais je laisse la tentative en commentaire
                        // lignes, colonnes et diag dans ce tableau
            rows = []
            // on fait un double parcous pour indexer chaque valeur possible pour toutes les lignes/colonnes/diagonales
            // et ainsi pouvoir regarder combien d'enchaînements possible, donc de points
            grid.map((row, indexX) => {
                tempRow = []
                tempCol = []
                tempDiag = []
                tempRow.push(row);
                row.map((cell, indexY) => {
                    tempCol.push(grid[indexY])
                    tempDiag.push(row[indexX][indexY])
                })
                rows.push(tempRow)
                rows.push(tempCol)
                rows.push(tempDiag)
            })
            return rows
             */
            let counts = {
                "player:1": { lineOf3: 0, lineOf4: 0, lineOf5: false },
                "player:2": { lineOf3: 0, lineOf4: 0, lineOf5: false }
            };

            // Function to check if a given cell is within the bounds of the grid
            function isValidCell(row, col) {
                return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
            }

            // Function to check if a given line contains only one player's cells
            function isLineOfPlayer(line, player) {
                return line.every(cell => cell && cell.owner === player);
            }


            // Function to count lines of different lengths
            function countLineLengths(line) {
                // Filter out undefined cells from the line array
                line = line.filter(cell => cell !== undefined);

                // Check if all cells in the line belong to the same player
                if (line.length > 0 && line.every(cell => cell.owner === line[0].owner && cell.owner !== null)) {
                    let length = line.length;
                    let chainOf5 = false;
                    let chainOf4 = false;
                    let chainOf3 = false;
                    if (length === 5) {
                        counts[line[0].owner].lineOf5 = true;
                        counts[line[0].owner].lineOf4 -= 1; // Reset count of lines of length 4
                        counts[line[0].owner].lineOf3 -= 1; // Reset count of lines of length 3
                        chainOf5 = true

                    } else if (length === 4 && !chainOf5) {
                        counts[line[0].owner].lineOf4++;
                        counts[line[0].owner].lineOf3 = -1; // Reset count of lines of length 3
                        chainOf4 = true
                    } else if (length === 3 && !chainOf5 && !chainOf4) {
                        counts[line[0].owner].lineOf3++;
                        chainOf3 = true
                    }
                }
            }


// Check horizontal lines
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length - 2; col++) {
                    let line = [grid[row][col], grid[row][col + 1], grid[row][col + 2]];
                    if (isLineOfPlayer(line, grid[row][col].owner)) {
                        countLineLengths(line);
                    }
                    // Check for lines of length 4
                    if (col < grid[row].length - 3) {
                        line.push(grid[row][col + 3]);
                        if (isLineOfPlayer(line, grid[row][col].owner)) {
                            countLineLengths(line);
                        }
                        // Check for lines of length 5
                        if (col < grid[row].length - 4) {
                            line.push(grid[row][col + 4]);
                            if (isLineOfPlayer(line, grid[row][col].owner)) {
                                countLineLengths(line);
                            }
                        }
                    }
                }
            }

// Check vertical lines
            for (let col = 0; col < grid[0].length; col++) {
                for (let row = 0; row < grid.length - 2; row++) {
                    let line = [grid[row][col], grid[row + 1][col], grid[row + 2][col]];
                    if (isLineOfPlayer(line, grid[row][col].owner)) {
                        countLineLengths(line);
                    }
                    // Check for lines of length 4
                    if (row < grid.length - 3) {
                        line.push(grid[row + 3][col]);
                        if (isLineOfPlayer(line, grid[row][col].owner)) {
                            countLineLengths(line);
                        }
                        // Check for lines of length 5
                        if (row < grid.length - 4) {
                            line.push(grid[row + 4][col]);
                            if (isLineOfPlayer(line, grid[row][col].owner)) {
                                countLineLengths(line);
                            }
                        }
                    }
                }
            }

// Check diagonal lines (top-left to bottom-right)
            for (let row = 0; row < grid.length - 2; row++) {
                for (let col = 0; col < grid[row].length - 2; col++) {
                    let line = [grid[row][col], grid[row + 1][col + 1], grid[row + 2][col + 2]];
                    if (isLineOfPlayer(line, grid[row][col].owner)) {
                        countLineLengths(line);
                    }
                    // Check for lines of length 4
                    if (row < grid.length - 3 && col < grid[row].length - 3) {
                        line.push(grid[row + 3][col + 3]);
                        if (isLineOfPlayer(line, grid[row][col].owner)) {
                            countLineLengths(line);
                        }
                        // Check for lines of length 5
                        if (row < grid.length - 4 && col < grid[row].length - 4) {
                            line.push(grid[row + 4][col + 4]);
                            if (isLineOfPlayer(line, grid[row][col].owner)) {
                                countLineLengths(line);
                            }
                        }
                    }
                }
            }

// Check diagonal lines (top-right to bottom-left)
            for (let row = 0; row < grid.length - 2; row++) {
                for (let col = 2; col < grid[row].length; col++) {
                    let line = [grid[row][col], grid[row + 1][col - 1], grid[row + 2][col - 2]];
                    if (isLineOfPlayer(line, grid[row][col].owner)) {
                        countLineLengths(line);
                    }
                    // Check for lines of length 4
                    if (row < grid.length - 3 && col > 1) {
                        line.push(grid[row + 3][col - 3]);
                        if (isLineOfPlayer(line, grid[row][col].owner)) {
                            countLineLengths(line);
                        }
                        // Check for lines of length 5
                        if (row < grid.length - 4 && col > 2) {
                            line.push(grid[row + 4][col - 4]);
                            if (isLineOfPlayer(line, grid[row][col].owner)) {
                                countLineLengths(line);
                            }
                        }
                    }
                }
            }


            if(counts["player:1"].lineOf3 < 0) counts["player:1"].lineOf3 = 0
            if(counts["player:1"].lineOf4 < 0) counts["player:1"].lineOf3 = 0


            // On reaffecte ensuite les valeurs de notre bareme (idealement, le foutre en constante pour ne l'avoir qu'a un seul endroit
            let res = {
                player1: counts["player:1"].lineOf5 ? 1000 : (counts["player:1"].lineOf3*10)+(counts["player:1"].lineOf4*50),
                player2: counts["player:2"].lineOf5 ? 1000 : (counts["player:2"].lineOf3*10)+(counts["player:2"].lineOf4*50),
            }

            return res;
        },
        getUnavailableChoices: (grid) => {
            let res = []
            grid.map((row, indexX) => {
                row.map((cell, indexY) => {
                    if(cell.owner){
                        res.push(cell.id)
                    }
            })})
            let counts = {};
            res.forEach(val => {
                counts[val] = (counts[val] || 0) + 1;
            });

            return Object.keys(counts).map(key => {
                let obj = {};
                obj[key] = counts[key];
                return obj;
            });
        },
    },

    dices: {
        roll: (dicesToRoll) => {
            if (!dicesToRoll) {
                console.error("Error: dicesToRoll is undefined");
                return [];
            }
            return dicesToRoll.map(dice => {
                    if (dice.value === "") {
                        // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                        const newValue = String(Math.floor(Math.random() * 6) + 1);
                        return {
                            id: dice.id,
                            value: newValue,
                            locked: false
                        };
                    } else if (!dice.locked) {
                        // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                        const newValue = String(Math.floor(Math.random() * 6) + 1);
                        return {
                            ...dice,
                            value: newValue
                        };
                    } else {
                        // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse
                        return dice;
                    }
                });
        },
        lockEveryDice: (dicesToLock) => {
            return dicesToLock.map(dice => ({
                ...dice,
                locked: true
            }));
        }
    },
    utils: {
        // Return game index in global games array by id
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                } }
            return -1; },
        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },
    }
}
module.exports = GameService;