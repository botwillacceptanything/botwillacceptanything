#! /usr/bin/env node

(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'gulp',
        'gulp-jsdoc',
        'gulp-jshint',
        'gulp-spawn-mocha',
        'gulp-foreach',
    ];

    define(deps, function(gulp, jsdoc, jshint, mocha, foreach) {
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

        gulp.task('mocha', [], function () {
            return gulp.src('tests/unit/**/*.js', {read: false})
                .pipe(foreach(function (stream, file) {
                  return stream.pipe(mocha());
                }));
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
