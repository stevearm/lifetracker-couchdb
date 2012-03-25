function(doc) {
	// !code helpers/walkNodes.js
	
	var func = function(prefix, value) { emit(prefix, 1); };
	processNode(null, doc, {
		"array" : func,
		"value" : func
	});
}
