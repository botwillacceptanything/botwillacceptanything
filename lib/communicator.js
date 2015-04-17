(function() {

	var MULTIPLICATOR_PROXIMITY = 0.1;

	function Word(value, score) {
		this.value = value;
		this.score = score;
	}

	function rd(arr) {
		var r = Math.random();
		return arr[parseInt(r*arr.length)];
	}

	/**
	* Will return how much the bot likes a person.
	* The lover the returned number, the more he hates him, bigger numbers
	* indicate that he likes the person.
	* -10 is the most negative level, on which the bot outright hates the
	* person. +10 equals pure, eternal love.
	*/
	function getLoveLevel(name) {
		var score = 0;
		for(var i = 0; i < name.length; i++) {
			score += name.charCodeAt(i);
		}
		score %= 20;
		score -= 10;
		return score;
	}


	function instrument(string, words) {
		var regex = /\{\{(.*?)\}\}/;
		var res;
		var score = 0;
		while((res = regex.exec(string)) != null) {
			var group = res[0];
			var key = res[1];
			var index = res.index;
			if(words[key] !== undefined) {
				var word = rd(words[key]);
				console.log(word);
				var ws = word.score;
				var val = word.value;
				if(words["multiplicators"] !== undefined && Math.random() < MULTIPLICATOR_PROXIMITY) {
					var multi = rd(words["multiplicators"]);
					ws *= multi.score;
					val = multi.value + " " + val;
				}
				score += ws;
				string = string.substr(0, index) + val + string.substr(index + group.length, string.length);
				console.log("regex:" + score + "\"" + string + "\"");
			}
			else {
				return "UNDEFINED TEMPLATE: " + group
			}
		}
		return {
			score : score,
			string : string
		};
	}

	function randomNegativeConstruct() {
		var words = {
			place : [  // Places no one would like to go
				new Word('flowerfield', 10),
				new Word('ponyranch', 5),
				new Word('the bed', 7),
				new Word('garden', 6),
				new Word('meadow', 2)
			],
			personAction : [  // Actions the person should take
				new Word('cuddle', 5),
				new Word('peep', 6),
				new Word('dream', 6),
				new Word('sleep', 3),
				new Word('play with me', 5),
				new Word('ride ponys', 7),
				new Word('lie in the grass', 9)
			],
			attribute : [
				new Word('beautiful', 3),
				new Word('cute', 2),
				new Word('fluffy', 4),
				new Word('tiny', 2),
				new Word('nice', 2)
			],
			multiplicators : [
				new Word('cute', 2)
			],
			name : [
				new Word('bunny', 3),
				new Word('flower', 3),
				new Word('fluff', 2),
				new Word('bird', 1),
				new Word('puppy', 2),
				new Word('kitty', 4),
				new Word('beetle', 6),
				new Word('chocolate', 7)
			]
		};

		var sentences = [
			"Why can't you just {{personAction}}?",
			"You are a {{attribute}} {{name}}.",
			"I hope you go to {{place}} and never come back!"
		];
		return instrument(rd(sentences), words);
	}

	function reactToPerson(name) {
		/*
		 * Based upon this score we select constructs until it gets close to zero.
		 */
		var string = score + ": ";
		var score = getLoveLevel(name) * 100;
		if(score < 0) {
			score *= -1;
			while(score > 0) {
				var sentence = randomNegativeConstruct();
				string += sentence.string + " ";
				console.log(sentence);
				console.log("jolo" + score);
				score -= sentence.score;
			}
		}
		else {
			string = score;
		}
		return string;
	}

	module.exports = reactToPerson;
	reactToPerson("huuhuhu");
})();
