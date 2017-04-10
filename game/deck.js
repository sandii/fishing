let Card = require('./card');

class Deck () {
	constructor () {
		this.cards = [];
		['heart', 'diamond', 'spade', 'club'].forEach(suit => {
			[2,3,4,5,6,7,8,9,10,'J','Q','K','A'].forEach(rank => {
				this.cards.push(new Card(suit, rank));
			});
		});
		this.cards.push(new Card('joker-1'));
		this.cards.push(new Card('joker-2'));
	}
	shuffle () {
		let len = this.cards.length;
		for (let i = len - 1; i > 0; i--) {
			let r = Math.floor(Math.random() * (i + 1)), temp;
			temp = deck[i], deck[i] = deck[r], deck[r] = temp;
		}
		return this;
	}
	deal (n) {
		if (this.cards.length < n) return [];
		return this.cards.splice(this.cards.length - n, n);
	}
}
module.exports = Deck;
