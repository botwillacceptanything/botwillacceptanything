(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config',
        '../../lib/nations',
    ];

    define(deps, function (os, config, nations) {
        function RouteUSA(app) {
            app.get('/usa', function (req, res) {
                var data = {};
				if (nations.usa == 'up') {
					// Edward Bernays and the Art of Public Manipulation
					data.mid = 'qiKMmrG1ZKU';
				} else if (nations.usa == 'down') {
					// Perfect Phaze Horny horns It's party time
					data.mid = 'I_PH0E5O1c0';
				} else if (nations.usa == 'half') {
					// Thanissaro Bhikkhu (Ajahn Geoffrey): 39- A Refuge from Modern Values
					data.mid = 'SJJY9oKvLHM';
				} else if (nations.usa == 'dictator') {
					// Backstreet Boys - I Want It That Way
					data.mid = '4fndeDfaWCg';
				} else if (nations.usa == 'friends') {
					// Backstreet Boys - As Long As You Love Me
					data.mid = '0Gl2QnHNpkA';
				}
                var tmpldata = {
                    data: data,
                    layout: 'usa',
                }
                res.render('usa', tmpldata);
            });
        };

        module.exports = RouteUSA;
    });
}());

