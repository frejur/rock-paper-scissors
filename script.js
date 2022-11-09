"use strict";
let gameObject = (() => {
    const _choices = ["Rock", "Paper", "Scissors"];
    const _choices_lc = _choices.map(_trimAndMakeLowerCase);
    let _rules = new Array;

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
        choices: _choices,
        rules:   _rules,
        addRule:    (choiceA, choiceB) => _addRuleChoiceBeatsWhat(choiceA, choiceB),
        printRules: () => _logToConsoleWhichChoiceBeatsWhat(),
        whoWins:    (choiceA, choiceB) => _getResultsObject(choiceA, choiceB)
    };
})();

gameObject.addRule("Rock", "Scissors");
gameObject.addRule("Paper", "Rock");
gameObject.addRule("Scissors", "Paper");
gameObject.printRules();

function getComputerChoice(choices) {
    if (Array.isArray(choices))
        return choices[Math.floor(Math.random() * choices.length)];
}

function playRound(playerSelection, computerSelection) {
    let result = gameObject.whoWins(playerSelection, computerSelection);
    let msg;
    switch (result.outcome) {
        case "Draw":
            msg = "It's a draw! (Both chose " + result.both + ")";
            break;
        case "Victory":
            msg = "You win! " + result.winner + " beats " + result.loser + ".";
            break;
        case "Defeat":
            msg = "You lose! " + result.winner + " beats " + result.loser + ".";
            break;
        default:
            msg = "Invalid input: Please review the rules.";
    }
    console.log(" -> " + msg);
    return result.outcome;
}

function game(rounds) {
    if (typeof rounds !== "number")
        rounds = 5;
    else
        rounds = Math.max(1, Math.min(rounds, 20));

    let scorePlayer = 0, scoreComputer = 0;
    for (let r=1; r <= rounds; ++r) {
        let playerSelection = prompt("Round " + r + ": Choose your weapon!");
        if (playerSelection === null) break;
        let result = playRound(playerSelection, getComputerChoice(gameObject.choices));
        switch (result) {
            case "Draw":
                continue;
            case "Victory":
                ++scorePlayer;
                break;
            case "Defeat":
                ++scoreComputer;
                break;
            default:
                --r; // Most likely faulty input, keep trying
        }
    }
    let headline;
    if (scorePlayer === scoreComputer)
        headline = "It's a Draw!";
    else if (scorePlayer > scoreComputer)
        headline = "Victory!";
    else
        headline = "You were defeated.";
    console.log(headline + '\n' +
                "You: " + scorePlayer + " point(s) | " +
                "Opponent: " + scoreComputer + " point(s)");
}

const btns = document.querySelectorAll("button.player-select");
btns.forEach( btn => {
    btn.addEventListener("click", () => playRound(btn.getAttribute("data-selection"),
                                                  getComputerChoice(gameObject.choices)) );
});