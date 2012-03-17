function(doc) {
	// !code helpers/walkNodes.js
	
	processNode(null, doc, {
		"object" : function(prefix, key) { emit(prefix, "object"); },
		"array" : function(prefix, values) { emit(prefix, "array"); },
		"value" : function(prefix, value) { emit(prefix, typeof(value)); }
	});
}
