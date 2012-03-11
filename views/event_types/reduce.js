function(key, values, rereduce) {
	var map = {};
	for (var i in values) { map[values[i]] = 1; }
	var result = [];
	for (var v in map) { result.push(v); }
	if (result.length == 1) { return result[0]; }
	return result;
}
