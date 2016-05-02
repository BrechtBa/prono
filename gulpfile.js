var gulp = require('gulp');
var eventStream = require('event-stream');
var vulcanize = require('gulp-vulcanize');

gulp.task('copy', function() {
	return eventStream.merge(
		gulp.src(['www/frontend/bower_components/webcomponentsjs/**/*']).pipe(gulp.dest('build/frontend/bower_components/webcomponentsjs')),
		gulp.src(['www/frontend/images/**/*']).pipe(gulp.dest('build/frontend/images')),
		gulp.src(['www/frontend/scripts/**/*']).pipe(gulp.dest('build/frontend/scripts')),
		gulp.src(['www/frontend/styles/**/*']).pipe(gulp.dest('build/frontend/styles')),
		gulp.src(['www/frontend/index.html']).pipe(gulp.dest('build/frontend')),
		gulp.src(['www/frontend/manifest.json']).pipe(gulp.dest('build/frontend')),
		gulp.src(['www/frontend/favicon.ico']).pipe(gulp.dest('build/frontend')),
		gulp.src(['www/frontend/robots.txt']).pipe(gulp.dest('build/frontend'))
	);
});

gulp.task('vulcanize', ['copy'], function() {
	return gulp.src('www/frontend/elements/elements.html')
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}))
		.pipe(gulp.dest('build/frontend/elements'));
});

gulp.task('default', ['copy','vulcanize']);