import gulp from 'gulp';
import babel from 'gulp-babel';
import Cache from 'gulp-file-cache';

let cache = new Cache();
let DIR = {
    SRC: 'html', // 작업을 진행할 폴더명입니다
    DEST: 'html_build', // 작업된 파일들을 컴파일하여 정리해두는 폴더입니다. 
    PORT: 8005 // 서버가 실행될 포트 번호입니다. 
}; 
const SRC = {
    JS: DIR.SRC + '/js/*.js',
    CSS: DIR.SRC + '/css/*.css',
    HTML: DIR.SRC + '/*.html',
    IMAGES: DIR.SRC + '/images/*',
    SERVER: 'server/**/*.js'
};

const DEST = {
    JS: DIR.DEST + '/js',
    CSS: DIR.DEST + '/css',
    HTML: DIR.DEST + '/',
    IMAGES: DIR.DEST + '/images',
    SERVER: 'app'
};

gulp.task('babel', () => {
    return gulp.src(SRC.SERVER)
        .pipe(cache.filter())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(cache.cache())
        .pipe(gulp.dest(DEST.SERVER));
});