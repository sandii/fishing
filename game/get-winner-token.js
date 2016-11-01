const cardValueList = require('./card-value-list');

function getWinnerToken (players) {
	let max = 0;
	let winnerToken = null;
	for (let o of players) {
		let value = handToValue(o.hand);
		if (value > max){
			max = value;
			winnerToken = o.token;
		}
		if (value === max) {
			winnerToken = null;
		}
	}
	return winnerToken;
}
function handToValue (hand) {
	// let key = hand[0].toString() +'-'+ hand[1].toString;
	// return cardValueList[key];

	return (toNum(hand[0].rank) + toNum(hand[1].rank)) % 10;
	function toNum (r) {
		if (r === 'J') return 11;
		if (r === 'Q') return 12;
		if (r === 'K') return 13;
		if (r === 'A') return 1;
		if (r === '')  return 6;
		return r;
	}
}
