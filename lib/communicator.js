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


	function instrument(string, words, person) {
		var regex = /\{\{(.*?)\}\}/;
		var res;
		var score = 0;
		while((res = regex.exec(string)) != null) {
			var group = res[0];
			var key = res[1];
			var index = res.index;
			if(key == "person") {
				string = string.substr(0, index) + person + string.substr(index + group.length, string.length);
			}
			else if(words[key] !== undefined) {
				var word;
				do {
					word = rd(words[key]);
				} while(Math.random() > 1/(word.score*word.score));
				var ws = word.score;
				var val = word.value;
				if(words["multiplicators"] !== undefined && Math.random() < MULTIPLICATOR_PROXIMITY) {
					var multi = rd(words["multiplicators"]);
					ws *= multi.score;
					val = multi.value + val;
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

	function randomNegativeConstruct(name) {
		var words = {
			place : [  // Places no one would like to go
				new Word('hell', 10),
				new Word('hospital', 5),
				new Word('4chan', 7),
				new Word('your mothers anus', 6),
				new Word('somewhere else', 2)
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
				new Word('fucking ', 3),
			],
			name : [
				new Word('bitch', 3),
				new Word('idiot', 3),
				new Word('fucker', 2),
				new Word('retard', 4),
				new Word('kid', 1),
				new Word('douchebag', 2),
				new Word('morron', 4),
				new Word('asshole', 6),
				new Word('goatf***er', 7)
			],
			botAction : [
				new Word('kill', 7),
				new Word('punch', 5),
				new Word('beat', 5),
				new Word('kick', 3),
				new Word('ban', 8)
			]
		};

		var sentences = [
			"{{person}}, why can't you just {{personAction}}?",
			"Just {{personAction}}, {{person}}!",
			"{{person}}, you are a {{attribute}} {{name}}.",
			"I hope you go to {{place}} and never come back!",
			"Please just {{personAction}}, {{person}}!",
			"I hate you {{person}}. Better watch out or I will {{botAction}} you.",
			"{{person}} is a {{name}}.",
			"{{person}} you are {{attribute}} and no one likes you.",
			"Hello, {{person}}, looks like you didn't {{personAction}} yesterday. Too bad."
		];
		return instrument(rd(sentences), words, name);
	}

	function randomNeutralConstruct(name) {
		var words = {
			mode : [
				new Word("okay", 1),
				new Word("nice", 4),
				new Word("", 1),
				new Word("alright", 1),
				new Word("not too bad", 1)
			]
		};

		var sentences = [
			"I hope you had an {{mode}} day.",
			"It's {{mode}} to see you.",
			"Whats up?.",
			"I hope everything is {{mode}}."
		];
		return instrument(rd(sentences), words, name);
	}

	function randomPositiveConstruct(name) {
		var words = {
			botActions : [
				new Word('like', 3),
				new Word('love', 10),
				new Word('appreciate', 2)
			],
			attribute : [
				new Word('great', 4),
				new Word('nice', 2),
				new Word('cool', 3),
				new Word('the best', 5),
				new Word('smart', 2),
				new Word('intelligent', 2),
				new Word('beautiful', 2)
			],
			feeling : [
				new Word('great', 4),
				new Word('nice', 2),
				new Word('cool', 3)
			],
			multiplicators : [
				new Word('super-', 2.5),
				new Word('ultra-', 1.5),
				new Word('very much ', 1.5)
			],
			action : [
				new Word('hang out', 1),
				new Word('chill', 2),
				new Word('play', 4),
				new Word('drink some beer', 4),
				new Word('cuddle', 8),
				new Word('have a baby', 10)
			],
			quantity : [
				new Word('more often', 2),
				new Word('sometime', 1),
				new Word('today', 1),
				new Word('always', 5),
				new Word('tomorrow', 1),
				new Word('again', 1)
			]
		};

		var sentences = [
			"I {{botActions}} you.",
			"I {{botActions}} you. You are {{attribute}}.",
			"We should {{action}} together {{quantity}}.",
			"I hope you had a {{feeling}} day.",
			"It's {{feeling}} to see you!",
			"{{feeling}} to see you! Let's {{action}} {{quantity}}.",
			"It's {{feeling}} to see you!",
			"It's {{feeling}} to see you!"
		];
		return instrument(rd(sentences), words, name);
	}

	function greet(name) {
		/*
		 * Based upon this score we select constructs until it gets close to zero.
		 */
		var score = getLoveLevel(name);
		console.log("(Score: " + score + ")");
		var string = "";
		if(score <= -3) {
			score *= -1;
			while(score > 0) {
				var sentence = randomNegativeConstruct(name);
				string += sentence.string + " ";
				score -= sentence.score;
				score--;
			}
		}
		else if(score >= 3){
			var greetings = ["Hi", "Hey", "Hello", "Oh, hello"];
			while(score > 0) {
				var sentence = randomPositiveConstruct(name);
				string += sentence.string + " ";
				score -= sentence.score;
				score--;
			}
			string = rd(greetings) + " " + name + ", " + string;
		}
		else {
			var greetings = ["Hi", "Hey", "Hello"];
			if(score < 0) {
				score *= -1;
			}
			while(score > 0) {
				var sentence = randomNeutralConstruct(name);
				string += sentence.string + " ";
				score -= sentence.score;
				score--;
			}
			string = rd(greetings) + " " + name + ", " + string;
		}
		return string;
	}

	module.exports = {
		greet : greet
	}
})();
