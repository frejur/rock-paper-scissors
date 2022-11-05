"use strict";
const CHOICES = ["Rock", "Paper", "Scissors"];

function getComputerChoice(choices) {
    if (Array.isArray(choices))
        return choices[Math.floor(Math.random() * choices.length)];
}

let count = {};
let i = 0;
do {
    let c = getComputerChoice(CHOICES);
    count[c] = count[c] ?? 0;
    ++count[c];
    ++i;
} while (i < 200);

console.log(count);
