// let feedback = 'correct';
// let responseTime = 2.4
// let answer = 25;

// alert('You are ' + feedback + '. Answer: ' + answer + '. Response time: ' + responseTime);
// alert(`You are ${feedback}. Answer: ${answer}. Response time: ${responseTime}`);


// Part 1. Functions
let num1 = getRandomNumber(1, 10);
let num2 = getRandomNumber(0, 100);

console.log(num1);
console.log(num2);

displayRandomNumber();

function getRandomNumber(min, max) {
    let randomNumber = Math.floor(Math.random() * max) + min;
    return randomNumber;
}

function displayRandomNumber() {
    alert(getRandomNumber(1, 10));
}