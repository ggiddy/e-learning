var gulp = require('gulp');

var nodemon = require('gulp-nodemon');

gulp.task('default', function(){
    nodemon({
        script: './bin/www',
        ext: 'js',
        env: {
            port: 3000
        },
        ignore: ['./node-modules']
    })
    .on('restart', function(){
        console.log('Restarting...');
    });
});