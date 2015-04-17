#! /usr/bin/env node

(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './config.loader.js',

        'gulp',
        'gulp-jsdoc',
        'gulp-jshint',
        'gulp-mocha',
        'gulp-istanbul',
        'gulp-foreach',
    ];

    define(deps, function(config, gulp, jsdoc, jshint, mocha, istanbul, foreach) {
        var src = [
            'lib/*.js'
        ];

        gulp.task('lint', [], function () {
            return gulp.src(src)
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
        });

        gulp.task('jsdoc', [], function () {
            return gulp.src(src)
                .pipe(jsdoc.parser())
                .pipe(jsdoc.generator('data/doc/'));
        });

        gulp.task('mocha', [], function (cb) {
            var ciMode = (process.env.CI === 'true');
            process.env.BUILD_ENVIRONMENT = 'test';
            gulp.src(['./*.js', './lib/**/*.js', './test/mocks/**/*.js'])
                .pipe(istanbul())
                .pipe(istanbul.hookRequire())
                .on('finish', function () {
                return gulp.src('tests/unit/**/*.js', { read: false })
                    .pipe(mocha({
                      reporter: ((!ciMode && config.test_reporter) || 'spec'),
                    }))
                    .pipe(istanbul.writeReports())
                    .on('end', cb);
                });
        });

        // Build Task
        gulp.task('build', [
            'lint',
            'jsdoc',
            'test'
        ]);

        // Build Task
        gulp.task('test', [
            'mocha'
        ]);

        // Default Task
        gulp.task('default', [
            'build'
        ]);

    });
}());
