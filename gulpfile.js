const { src, dest, watch, parallel, series } = require("gulp");

const fs = require('fs');
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const scss = require('gulp-sass')(require('sass'));
const group_media = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const del = require("del");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const fileinclude = require("gulp-file-include");
const clean_css = require("gulp-clean-css");
const newer = require('gulp-newer');
const webp = require('imagemin-webp');
const webpcss = require("gulp-webpcss");
const webphtml = require('gulp-webp-html');
const fonter = require('gulp-fonter');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function browsersync() {
	browserSync.init({
		server: { baseDir: './dist/' },
		notify: false,
		online: true
	})
}

function html() {
	return src('#src/index.html')
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest('dist/'))
		.pipe(browserSync.stream());
}

function css() {
	return src('#src/scss/style.scss')
		.pipe(plumber())
		.pipe(scss({ outputStyle: "expanded" }))
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: ".webp",
				noWebpClass: ".no-webp"
			}
		))
		.pipe(dest('dist/css/'))
		.pipe(clean_css())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(dest('dist/css/'))
		.pipe(browserSync.stream());
}
function js() {
	return src(['#src/js/app.js', '#src/js/vendors.js'])
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(dest('dist/js/'))
		.pipe(uglify(/* options */))
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest('dist/js/'))
		.pipe(browserSync.stream());
}
function img() {
	return src('#src/img/**/*.{jpg,png,svg,gif,ico,webp}')
		.pipe(newer('dist/img/'))
		.pipe(
			imagemin([webp({ quality: 75 })])
		)
		.pipe(
			rename({ extname: ".webp" })
		)
		.pipe(dest('dist/img/'))
		.pipe(src('#src/img/**/*.{jpg,png,svg,gif,ico,webp}'))
		.pipe(dest('dist/img/'))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest('dist/img/'))
}

function videos() {
	return src('#src/videos/*.*')
		.pipe(plumber())
		.pipe(dest('dist/videos/'))
}

function fonts_otf() {
	return src('./#src/fonts/*.otf')
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest('./#src/fonts/'));
}
function fonts() {
	src('#src/fonts/*.ttf')
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest('dist/fonts/'));
	return src('#src/fonts/*.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('dist/fonts/'))
		.pipe(browserSync.stream());
}
function fontstyle() {
	let file_content = fs.readFileSync('#src/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile('#src/scss/fonts.scss', '', cb);
		return fs.readdir('dist/fonts/', function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile('#src/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() { }
function clean() {
	return del('./dist/')
}

function startwatch() {
	watch(['#src/**/*.html'], html)
	watch(['#src/scss/*.scss'], css)
	watch(['#src/js/**/*.js'], js)
	watch(['#src/img/**/*.{jpg,png,svg,gif,ico,webp}'], img)
}

let build = series(clean, fonts_otf, parallel(html, css, js, img, videos), fonts, parallel(fontstyle));

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.videos = videos;
exports.fonts_otf = fonts_otf;
exports.fontstyle = fontstyle;
exports.fonts = fonts;
exports.clean = clean;

exports.build = build;
exports.default = parallel(build, startwatch, browsersync);