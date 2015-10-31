function forEach(array, callback) {
	for(var i = 0; i < array.length; i++) {
		callback(array[i], i);
	}
}

function map(array, callback) {
	var mapped = [];
	forEach(array, function(item, i) {
		mapped.push(callback(item));
	});
	return mapped;
}

function filter(array, callback) {
	var filtered = [];
	forEach(array, function(item, i) {
		if(callback(item)) {
			filtered.push(item);
		}
	});
	return filtered;
}

function reduce(array, callback) {
	
}