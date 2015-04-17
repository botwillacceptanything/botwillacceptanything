(function() {
    'use strict';

    var fs = require('fs');

    var filename = 'name.txt';

    var vowels = ['a', 'e', 'i', 'o', 'u'];

    var consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j',
                      'k', 'l', 'm', 'n', 'p', 'q', 'r',
                      's', 't', 'v', 'w', 'x', 'y', 'z'];

    var attributes = ['mighty', 'foolish', 'glorious', 'one and only', 'great',
                      'insane', 'blessed', 'nice', 'friendly', 'beloved'];

    var titles = ['King', 'Conquerer', 'Emperor', 'Bot', 'Slug',
                  'Killer', 'Terminator', 'Beast', 'Dude', 'Destroyer',
                  'Friend', 'God', 'Deathbringer'];

    var secondary = ['the Internet', 'Doom', 'Hell', 'Github',
                     'the World', 'Kittens', 'the Night'];

    function pickRandom(arr) {
        var r = Math.random();
        return arr[parseInt(r*arr.length)];
    }

    function generateNaturalName() {
        var x = 1;
        var str = '';
        for(var i = 0; i < 2 || Math.random() < x; i++) {
            x *= 0.7;
            str += pickRandom(consonants);
            if(i === 0) {
                str = str.toUpperCase();
            }
            str += pickRandom(vowels);
        }
        return str;
    }

    function generateNewFullName() {
        var name = generateNaturalName() + ' ';
            name += generateNaturalName() + ' the ';
            name += pickRandom(attributes) + ' ';
            name += pickRandom(titles) + ' of ';
            name += pickRandom(secondary);
        return name;
    }

    function getName() {
        try {
            var name = fs.readFileSync(filename, 'utf8');
            return name;
        }
        catch(e) {
            var name = generateNewFullName();
            fs.writeFile(filename, name, function (err) {
                if(err) {
                    console.log(err);
                }
            });
            return name;
        }
    }

    module.exports = getName;
    console.log(getName());

})();
