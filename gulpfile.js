#! /usr/bin/env node

(function () {
    'use strict';


    var gulp = require('gulp');

    var bower = require('gulp-bower');
    var jsdoc = require('gulp-jsdoc');
    var jshint = require('gulp-jshint');

    var src = [
        'lib/*.js'
    ];

    gulp.task('bower', function() {
        return bower()
            .pipe(gulp.dest('data/components'))
    });

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

    // Build Task
    gulp.task('build', [
        'bower',
        'lint',
        'jsdoc',
    ]);

    // Default Task
    gulp.task('default', [
        'build'
    ]);

}());