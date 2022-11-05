"use strict";
let gameObject = (() => {
    const _choices = ["Rock", "Paper", "Scissors"];
    // make a version in lowercase for easier matching
    const _choices_lc = _choices.map(_trimAndMakeLowerCase);
    let   _rules   = new Array;

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
            { choice: a, beats: b }
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

    return {
        choices: _choices,
        rules:   _rules,
        addRule:    (choiceA, choiceB) => _addRuleChoiceBeatsWhat(choiceA, choiceB),
        printRules: () => _logToConsoleWhichChoiceBeatsWhat(),
    };
})();

gameObject.addRule("Rock", "Scissors");
gameObject.addRule("Paper", "Rock");
gameObject.addRule("Scissors", "Paper");

function getComputerChoice(choices) {
    if (Array.isArray(choices))
        return choices[Math.floor(Math.random() * choices.length)];
}

function playRound(playerSelection, computerSelection) {

}