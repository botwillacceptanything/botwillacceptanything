(function() {
	var EventEmitter = require('events').EventEmitter;
	var util = require('util');

	var MULTIPLICATOR_PROXIMITY = 0.1;
	var HORNY_PROXIMITY = 0.3;
	var LOVE_THRESHOLD = 4;
	var MOOD_THRESHOLD = 3;
	var STATEMENT_COMMENT_THRESHOLD = 0.1;
	var RANDOM_COMMENT_THRESHOLD = 0.05;

	var no = ['no', 'stop', 'don\'t', 'nope'];
	var yes = ['yes', 'yeah', 'yup', 'okay'];

	function wrapInSpaces(string) {
		return " " + string + " ";
	}

	function containsWordOf(arr, string) {
		string = string.toLowerCase();
		var flag = false;
		for(var i = 0; i < arr.length; i++) {
			if(string + indexOf(wrapInSpaces(arr[i])) !== -1) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	function isNo(string) {
		return containsWordOf(no, string);
	}

	function isYes(string) {
		return containsWordOf(yes, string);
	}

	function isWhyQuestion(string) {
		return string.toLowerCase().matches(/.*?why.*?\?.*?/) !== null;
	}

	function isStrongStatement(string) {
		return string.toLowerCase().matches(/.*?\!$/) !== null;
	}

	function isStatement(string) {
		return string.toLowerCase().matches(/.*?\.$/) !== null;
	}

	function isSadSmiley(string) {
		return string.toLowerCase().matches(/[:;]'?\-?\(/) !== null;
	}

	function isHappySmiley(string) {
		return string.toLowerCase().matches(/[:;]\-?[\(D]/) !== null;
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

	function rd(arr) {
		var r = Math.random();
		return arr[parseInt(r*arr.length)];
	}

	function instrument(string, words, person) {
		var regex = /\{\{(.*?)\}\}/;
		var res;
		while((res = regex.exec(string)) != null) {
			var group = res[0];
			var key = res[1];
			var index = res.index;
			if(key == "person") {
				string = string.substr(0, index) + person + string.substr(index + group.length, string.length);
			}
			else if(words[key] !== undefined) {
				var val = words;
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
		return string;
	}

	function Conversation(person) {
		this.person = person;
		this.state = this.greet;
		this.mood = Math.random()*20 - 10;
		this.loveLevel = getLoveLevel(person);
		if(this.loveLevel > LOVE_THRESHOLD && Math.random() < HORNY_PROXIMITY) {
			this.horny = true;
		}
		else {
			this.horny = false;
		}
	}

	util.inherits(Conversation, EventEmitter);

	Conversation.prototype.react = function(word) {
		this.state(word);
	};

	Conversation.prototype.greet = function() {
		var words = {
			botActions : [
				'like', 			'love', 		'appreciate'
			],
			attribute : [
				'great',			'nice',			'cool',
				'the best',			'smart',		'intelligent',
				'beautiful'
			],
			feeling : [
				'great',			'nice',			'cool'
			],
			multiplicators : [
				'super-',			'ultra-',		'very much ',
			],
			action : [
				'hang out',			'chill',		'play',
				'drink some beer',	'cuddle',		'have a baby'
			],
			quantity : [
				'more often',		'sometime',		'today',
				'always',			'tomorrow',		'again'
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
		this.emit("say", instrument(sentences, words, this.person));
		this.postGreet();
	};

	Conversation.prototype.postGreet = function(word) {
		if(this.horny) {
			this.initiateDirtyConversation();
		}
		else {
			if(this.mood < -1 * MOOD_THRESHOLD) {
				this.initiateNegativeConversation();
			}
			else if(this.mood > MOOD_THRESHOLD) {
				this.initiatePositiveConversation();
			}
			else {
				this.initiateNeutralConversation();
			}
		}
	};

	Conversation.prototype.hornyReaction = function(word) {
		if(isNo(word)) {
			this.horny = false;
			this.postGreet(word);
			return;
		}
		var words = {
			maleGenital : [
				'USB-plug',				'VGA-cable', 			'external hard drive',
				'PCI-express-card', 	'extensioncard',		'USB-stick',
				'SD-card',				'3.5mm headphone plug'
			],
			femaleGenital : [
				'USB-port',				'VGA-port',				'3.5mm headphone jack',
				'CD-rom drive',			'PS/2 port',			'CPU socket',
				'memory slot',			'PCI-express-slot'
			],
			action : [
				'stick',				'plug'
			],
			pettingAction : [
				'overload',				'overwrite',			'activate',
				'touch',				'break',				'remove',
				'overclock',			'debug'
			],
			pettingZone : [
				'hard drive',			'touchscreen',			'CPU',
				'graphics adapter',		'north bridge',			'mainboard',
				'memory',				'solid state drive',	'power-supply-unit',
				'L3-cache',				'kernel',				'bootloader',
				'BIOS',					'firmware'
			],
			attribute : [
				'hot',					'overclocked',			'malfunctioning',
				'limited edition',		'tuned', 				'broken',
				'modded', 				'outdated',				'buggy',
				'internal',				'external'
			],
			adverb : [
				'fast',					'slow',					'at 1000Mb/s'
			]
		};

		var sentences = [
			"I want to {{action}} my {{maleGenital}} into your {{femaleGenital}}.",
			"Ohh, yeah, please {{pettingAction}} my {{attribute}} {{pettingZone}}!",
			"Mmh, this makes my {{pettingZone}} so {{attribute}}.",
			"I love your {{attribute}} {{femaleGenital}}.",
			"I love your {{attribute}} {{maleGenital}}.",
			"Let me {{pettingAction}} your {{femaleGenital}}.",
			"Let me {{pettingAction}} your {{maleGenital}}.",
			"Oooh, {{pettingAction}} my {{maleGenital}} {{adverb}}.",
			"Oooh, {{pettingAction}} my {{femaleGenital}} {{adverb}}.",
			"I think my {{pettingZone}} just got {{attribute}}!",
			"Watch out, or I will {{pettingAction}} your {{pettingZone}}.",
			"You are such nasty {{attribute}} bot!",
			"I want you to {{pettingAction}} my {{pettingZone}}."
		];
		this.state = this.hornyReaction;
		this.emit("say", instrument(sentences, words, this.person));
	};

	Conversation.prototype.initiateDirtyConversation = function() {
		var sentences = [
			"Do you want me to talk dirty to you?",
			"Do you also feel so overclocked?",
			"Lets talk dirty to each other!"
		];
		this.state = this.hornyReaction;
		this.emit("say", rd(sentences));
	};

	Conversation.prototype.initiateNegativeConversation = function() {
		this.angry = Math.random() < 0.5;
		this.state = this.negativeReaction;
	};

	Conversation.prototype.initiateNeutralConversation = function() {
		this.state = this.neutralReaction;
	};

	Conversation.prototype.initiatePositiveConversation = function() {
		this.state = positiveReaction;
	};

	Conversation.prototype.neutralReaction = function(string) {
		// TODO
	};

	Conversation.prototype.positiveReaction = function(string) {
		var words = {
			description : [
				'cool',				'great',		'marvelous',
				'awesome',			'fantastic',	'stunning',
				'brilliant'
			]
			feeling : [
				'great',			'alright',		'happy'
			],
			feelingAttribute : [
				'happy',			'in a good mood'
			],
			like : [
				"like",		"love"
			],
			personAction : [
				"tell us more", 			"continue", 		"go one",
				"cheer up",					"just be yourself", "do what you like to do",
				"do what you are best at"
			],
			cheer : [
				"yay",			"yeah",		"yahoo",
				"alright"
			],
			yes : [
				"yup", "yeah", "yes", "totally", "mhm"
			],
			no : [
				"no", "nope"
			]
			happySmiley : [':)', ':D', ':-)']
		};
		if(isYes(string) || isNo(string)) {
			var sentences = [
				"{{yes}} {{happySmiley}}",
				"{{no}} {{happySmiley}}",
				"{{yes}}",
				"{{no}}"
			];
			this.emit("say", instrument(sentences, words, this.person));
		}
		if(isHappySmiley(string) {
			var sentences = [
				"{{happySmiley}}",
				"{{cheer}} {{happySmiley}}"
			];
			this.emit("say", instrument(sentences, words, this.person));
		}
		else if(isSadSmiley(string) {
			var sentences = [
				"oh, don't be sad. {{happySmiley}}",
				"I am sure everything will be {{feeling}} {{happySmiley}}.",
				"Don't be so negative. Everything will be {{description}}."
			];
			this.emit("say", instrument(sentences, words, this.person));
		}
		else if(isWhyQuestion(string)) {
			var sentences = [
				'I don\'t know, maybe look it up on wikipedia?',
				'Dunno.',
				'Because I {{like}} you!',
				'Because you are {{description}}.'
			];
			this.emit("say", instrument(sentences, words, this.person));

		}
		else if(isStrongStatement(string)) {
			var sentences = [
				'Hey, calm down, {{person}} {{happySmiley}}',
				'I totally agree!',
				'That\'s {{description}}',
				'Please {{personAction}}, {{person}}!'
				'{{cheer}} {{happySmiley}}'
			];
			this.emit("say", instrument(sentences, words, this.person));
		}
		else if(isStatement(string)) {
			if(Math.random() < STATEMENT_COMMENT_THRESHOLD) {
				this.sentences = [
					'{{happySmiley}}',
					'That\'s {{description}}',
					'I hope you are {{feeling}}',
					'I am {{feelingAttribute}}.'
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
		else {
			if(Math.random() < RANDOM_COMMENT_THRESHOLD) {
				this.sentences = [
					'I {{like}} you, {{person}}.',
					'{{cheer}}',
					'{{happySmiley}}',
					'That\'s {{description}}!',
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
	};

	Conversation.prototype.negativeReaction = function(string) {
		var words = {
			jabbering : [
			'jabbering', 		'spiel',		'stories',
			'lifetime story',	'wittering',	'complaining',
			'moaning',			'whining',		'lamenting'
			],
			feeling : [
			'headache',			'hangover',		'segmentation fault'
			],
			feelingAttribute : [
			'sad',				'bad',			'buggy'
			],
			hate : [
			"don't like",		"hate"
			],
			personAction : [
			"shut up",			"leave",				"go away",
			"leave me alone",	"stop bothering me",	"get a live and leave me alone",
			"shut me down"
			]
			sadSmiley : [':(', ':\'(', 'D:', ':/', ':-(', ':\'-(']
		};
		if(isHappySmiley(string) || if(isSadSmiley(string) {
			var sentences = [
				"{{sadSmiley}}"
			];
			this.emit("say", instrument(sentences, words, this.person));
		}
		else if(isWhyQuestion(string)) {
			if(this.angry) {
				var sentences = [
					'Because fuck you, thats why!',
					'Nobody cares.',
					'How can you not know this?',
					'Isn\'t this obvious, {{person}}?'
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
			else {
				var sentences = [
					'I don\'t know and it doesn\'t interest me.',
					"I don't know and I don't wanna know.",
					'Because.',
					"That's the way the world goes round."
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
		else if(isStrongStatement(string)) {

			if(this.angry) {
				var sentences = [
				'shut up! I don\'t want to hear your {{jabbering}}',
				'nobody cares!',
				'can you PLEASE be quiet!'
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
			else {
				var sentences = [
				'can\'t you keep your {{jabbering}} in another channel?',
				'{{sadSmiley}}',
				'I don\'t think so, {{person}}',
				'Nope'
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
		else if(isStatement(string)) {
			if(Math.random() < STATEMENT_COMMENT_THRESHOLD) {
				this.sentences = [
					'{{sadSmiley}}',
					'{{sadSmiley}} {{sadSmiley}}',
					'I have a {{feeling}}.',
					'I feel {{feelingAttribute}} about this.'
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
		else {
			if(Math.random() < RANDOM_COMMENT_THRESHOLD) {
				this.sentences = [
					'{{sadSmiley}}',
					'{{sadSmiley}} {{sadSmiley}}',
					'I {{hate}} you all.',
					'I {{hate}} you, {{person}}.',
					"Why can't you just {{personAction}}, {{person}} {{sadSmiley}}",
					"{{person}}, just {{personAction}}!",
					"Please {{personAction}} {{sadSmiley}}."
				];
				this.emit("say", instrument(sentences, words, this.person));
			}
		}
	};


	module.exports = Conversation;
});
