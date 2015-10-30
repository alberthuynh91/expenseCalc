function each(array, callback) {
	for(var i = 0; i < array.length; i++) {
		callback(array[i], i);
	}
}

function map(array, callback) {
	var mapped = []
	for (var i = 0; i < array.length; i++) {
		mapped.push(callback(array[i]));
	}
	return mapped;
}

