"use strict";
let gameObject = (() => {
    const _choices = ["Rock", "Paper", "Scissors"];
    const _choices_lc = _choices.map(_trimAndMakeLowerCase);
    let _rules = new Array;
    const _score = {
        "playerOne": 0, "playerTwo": 0
    };
    let _isActive = false;

    function _setPlayerScoresToZero() {
        _score.playerOne = 0, _score.playerTwo = 0;
    }

    function _activateGame() {
        _isActive = true;
    }

    function _deactivateGame() {
        _isActive = false;
    }

    function _addPointToPlayerScore(player) {
        if (!_isActive) return;
        if (typeof player !== "number") return;
        let pkey = "player" +
                   ((Math.max(Math.min(2, player), 0) === 1) ? "One" : "Two");
        ++_score[pkey];
    }

    function _trimAndMakeLowerCase (s) {
        return (typeof s === "string" ? s.trim().toLowerCase() : undefined);
    }

    function _getMatchingChoice (s) {
        for (let i=0; i < _choices_lc.length; ++i) {
            if (_choices_lc[i] === _trimAndMakeLowerCase(s))
                return _choices[i];
        }
    }

    function _addRuleChoiceBeatsWhat(a, b) {
        if (!(a = _getMatchingChoice(a)) ||
            !(b = _getMatchingChoice(b))) return;

        _rules.push(
            { choice: a,
              beats: b }
        );
    }

    function _logToConsoleWhichChoiceBeatsWhat() {
        let len = _rules.length;
        if (!len) return console.log("There have been no rules defined for this game.");

        let intro = "Rules of the game:";
        let body = "";
        _rules.forEach( (r) => {
            body += " - ";
            body += r.choice + " beats " + r.beats;
            body += "\n";
        });
        console.log(intro + '\n' +
                    "=========================" + '\n' +
                    body);
    }

    function _whichChoiceBeatsTheOther(a, b) {
        /**
         * Tries to determine a winner out of choices:
         * @param a - Choice A
         * @param b - Choice B
         * @return {number}
        *          0 - If any of the choices are invalid
        *              OR if a rule cannot be found.
        *          1 - If a wins.
        *          2 - If b wins.
        *          3 - If it's a draw
         */
        
        if (a === b) return 3;

        let winner = _findWinnerFromMatchingRule(a, b);
        if (!winner) return 0;

        return (winner === a) ? 1 : 2;
    }

    function _findWinnerFromMatchingRule(a, b) {
        for (let i=0; i < _rules.length; ++i) {
            let r = _rules[i];
            if (r.choice === a && r.beats === b) return a;
            if (r.choice === b && r.beats === a) return b;
        }
    }

    /**
     * @typedef {Object} Result
     * @property {string} outcome - <"Error" | "Victory" | "Defeat" | "Draw"> (from A's POV).
     * @property {string} winner - The name of the winning choice
     * @property {string} loser - The name of the losing choice
     * @property {string} both - The name of the choice picked by both when the outcome is a draw
     */

    function _getResultsObject(a, b) {
        /**
         * Get information about the outcome of choices:
         * @param a - Choice A
         * @param b - Choice B
         * 
         * Return
         * @return {Result}
         *         Information about the outcome
         */
        if (!(a = _getMatchingChoice(a)) ||
            !(b = _getMatchingChoice(b))) return 0;
        
        let res = _whichChoiceBeatsTheOther(a, b);
        
        if (res === 0) return { outcome: "Error" };
        if (res === 3) return { outcome: "Draw", both: a };

        return {
            outcome: res == 1 ? "Victory" : "Defeat",
            winner:  res == 1 ? a : b,
            loser:   res == 2 ? a : b
        }
    }

    return {
        choices:  _choices,
        rules:    _rules,
        score:    _score,
        addRule:    (choiceA, choiceB) => _addRuleChoiceBeatsWhat(choiceA, choiceB),
        printRules: () => _logToConsoleWhichChoiceBeatsWhat(),
        whoWins:    (choiceA, choiceB) => _getResultsObject(choiceA, choiceB),
        newGame: function () {
            _setPlayerScoresToZero();
            _activateGame();
        },
        addPoint:   (player) => _addPointToPlayerScore(player),
        isActive: () => { return _isActive; },
        deactivateGame: _deactivateGame
    };
})();

gameObject.addRule("Rock", "Scissors");
gameObject.addRule("Paper", "Rock");
gameObject.addRule("Scissors", "Paper");
gameObject.printRules();

let resultDOM = function () {
    let _root = document.getElementById("result");
    let _newGame = document.getElementById("new-game");
    let _scoreBoard = document.getElementById("score-board");
    let _gameOver = document.getElementById("game-over");
    return {
        root: _root,
        newGame: _newGame,
        scoreBoard: _scoreBoard,
        gameOver: _gameOver
    };
}();

function getComputerChoice(choices) {
    if (Array.isArray(choices))
        return choices[Math.floor(Math.random() * choices.length)];
}

function processPlayerInput(playerInput) {
    if (!gameObject.isActive()) {
        if (playerInput === "newGame") {
            newGame();
        }
    } else {
        playRound(playerInput, getComputerChoice(gameObject.choices));
        updateResult();
    }
}

function playRound(playerSelection, computerSelection) {
    let result = gameObject.whoWins(playerSelection, computerSelection);
    let msg;
    switch (result.outcome) {
        case "Draw":
            msg = "It's a draw! (Both chose " + result.both + ")";
            break;
        case "Victory":
            gameObject.addPoint(1);
            msg = "You win! " + result.winner + " beats " + result.loser + ".";
            break;
        case "Defeat":
            gameObject.addPoint(2);
            msg = "You lose! " + result.winner + " beats " + result.loser + ".";
            break;
        default:
            msg = "Invalid input: Please review the rules.";
    }
    return msg;
}

function updateResult() {
    if (!(resultDOM.newGame.classList.contains("hidden")))
        resultDOM.newGame.classList.add("hidden");
    if (resultDOM.scoreBoard.classList.contains("hidden"))
        resultDOM.scoreBoard.classList.remove("hidden");
    let r = gameObject.score;
    if (r.playerOne + r.playerTwo >= 5)
        announceWinner( (r.playerOne > r.playerTwo ? 1 : 2) );
    else
        updateScoreBoard(r.playerOne, r.playerTwo)
}

function announceWinner(winner) {
    gameObject.deactivateGame();
    resultDOM.gameOver.classList.remove("hidden");
    resultDOM.scoreBoard.classList.add("hidden");
    console.log("Winner: " + winner);
}

function updateScoreBoard(playerScore, opponentScore) {
    console.log("Score: " + playerScore + " | " + opponentScore);
}

function newGame() {
    resultDOM.newGame.classList.remove("hidden");
    resultDOM.scoreBoard.classList.add("hidden");
    resultDOM.gameOver.classList.add("hidden");
    gameObject.newGame();
}

const btns = document.querySelectorAll("button");
btns.forEach( btn => {
    btn.addEventListener("click", () => processPlayerInput(btn.getAttribute("data-selection")));
});
newGame();