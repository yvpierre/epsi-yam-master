// websocket-server/services/game.service.js
const TURN_DURATION = 45;

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
        deck: {}
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

            }

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
            let hasStraight = !counts.find((x) => x > 1);
            // total
            let sum = counts.reduce((acc, elem, index) => acc + (elem * index), 0);
            // moins 2 huit
            let isLessThanEqual8 = sum <= 8;

            if (hasThreeOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "brelan"+threeOfAKindValue))
            if (hasFourOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "carre"));
            if (hasFiveOfAKind) availableCombinations.push(allCombinations.find(comb => comb.id === "yam"));
            if (hasFull) availableCombinations.push(allCombinations.find(comb => comb.id === "full"))
            if (hasStraight) availableCombinations.push(allCombinations.find(comb => comb.id === "suite"))
            if (isLessThanEqual8) availableCombinations.push(allCombinations.find(comb => comb.id === 'moinshuit'))

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

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
            return grid.map(row => row.map(cell => {
                if (cell.id === idSelectedChoice && cell.owner === null) {
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
            // lignes
            rows = []
            //  colonnes
            columns = []
            // diagonales
            diag = []
            // on fait un double parcous pour indexer chaque valeur possible pour toutes les lignes/colonnes/diagonales
            // et ainsi pouvoir regarder combien d'enchaînements possible, donc de points
            grid.map((row, indexX) =>
                row.map((cell, indexY) => {
                    rows.push(row[indexX].value)
                }))
            return
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
        }
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