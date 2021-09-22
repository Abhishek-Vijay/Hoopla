const gulp = require('gulp');
const fs = require('fs');
const eslint = require('gulp-eslint');
const reporters = require('jasmine-reporters');
const jasmine = require('gulp-jasmine')
const exit = require('gulp-exit');
const istanbul = require('gulp-istanbul');

/* GULP TASK DEMONSTRATION */
// gulp.task('hello', () => {
//     console.log("my first gulp task executed");
// })

/* GULP TASK TO AUTOMATE LINTING */
gulp.task('lint', async () => {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslint.format('html', fs.createWriteStream('lintReports/lint_report.html')))
        .pipe(eslint.format('checkstyle', fs.createWriteStream('lintReports/checkstyle.xml')))
        .pipe(eslint.failAfterError());
});


gulp.task('test', async () => {
    return gulp.src(['specs/*.js', '!gulpfile.js'])
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter({
                savePath: 'testReport/JUnit'
            })
        }))
        // gulp-exit ensures that the task is terminated after finishing.
        .pipe(exit());
})

gulp.task('pre-coverage', function () {
    return gulp.src(['**/*.js', '!gulpfile.js', '!node_modules/**'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('coverage', gulp.series('pre-coverage', async function () {
    return gulp.src(['specs/*.js'])
        .pipe(jasmine())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: ['lcovonly', 'json', 'text', 'text-summary', 'cobertura'],
            reportOpts: {
                lcov: { dir: 'coverage/lcovonly', file: 'lcov.info' },
                json: { dir: 'coverage/json', file: 'converage.json' },
                cobertura: { dir: 'coverage/cobertura', file: 'cobertura-coverage.xml' }
            }
        }))
        // Enforce a coverage of at least 65%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 65 } }))
        .pipe(exit());
}))