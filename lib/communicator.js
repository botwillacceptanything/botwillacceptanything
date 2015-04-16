(function() {
	var MULTIPLICATOR_PROXIMITY = 0.05;

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
				var ws = word.score;
				var val = word.value;
				if(words["multiplicators"] !== undefined && Math.random() < MULTIPLICATOR_PROXIMITY) {
					var multi = rd(words["multiplicators"]);
					ws *= multi.score;
					val = multi.value + " " + val;
				}
				score += ws;
				string = string.substr(0, index) + val + string.substr(index + group.length, string.length);
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
				new Word('hell', 10),
				new Word('hospital', 5),
				new Word('4chan', 7),
				new Word('your mothers anus', 6),
				new Word('away', 2)
			],
			personAction : [  // Actions the person should take
				new Word('die', 5),
				new Word('suffocate', 6),
				new Word('suffer a horrible death', 6),
				new Word('get rekt', 3),
				new Word('get killed', 5),
				new Word('get cancer', 7),
				new Word('get raped', 9)
			],
			attribute : [
				new Word('ugly', 3),
				new Word('stinky', 2),
				new Word('worthless', 4),
				new Word('stupid', 2),
				new Word('dumb', 2)
			],
			multiplicators : [
				new Word('f***ing', 2)
			],
			name : [
				new Word('bitch', 3),
				new Word('idiot', 3),
				new Word('f***er', 2),
				new Word('kid', 1),
				new Word('douchebag', 2),
				new Word('morron', 4),
				new Word('asshole', 6),
				new Word('goatf***er', 7)
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
		var score = getLoveLevel(name) * 2;
		var string = score + ": ";
		if(score < 0) {
			score *= -1;
			while(score > 0) {
				var sentence = randomNegativeConstruct();
				string += sentence.string + " ";
				score -= sentence.score;
			}
		}
		else {
			string = score;
		}
		return string;
	}

	module.exports = reactToPerson;
	console.log(reactToPerson("huuhuhu"));
})();
