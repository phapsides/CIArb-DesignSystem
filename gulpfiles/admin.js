const config = require("../package.json");
const gulp = require("gulp");

gulp.task("copy-webconfig", function () {
	return gulp.src("./web.config").pipe(gulp.dest("./dist/"));
});

gulp.task("admin", gulp.series("copy-webconfig"));
