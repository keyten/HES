// Utils

export function ajax(url, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callback(xhttp.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

export function trim(str) {
	return (str || '').replace(/^\s+|\s+$/g, '')
}

export function delayedStart(expr, callback) {
	if (!expr()) {
		return setTimeout(delayedStart.bind(this, expr, callback), 100)
	}
	callback()
}

export function _f() {}
