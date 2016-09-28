const fs = require("fs");
const browserify = require("browserify");
const babelify = require("babelify");

browserify("src/main.js", {debug: false})
	.transform(babelify, {presets: ["es2015"]})
	.bundle()
	.on("error", function (err) {
		console.log("Error: " + err.message);
	})
	.pipe(fs.createWriteStream("hes.user.js"));
