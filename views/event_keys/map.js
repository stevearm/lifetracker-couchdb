function(doc) {
	// !code helpers/walkNodes.js
	
	processNode(null, doc, {
		"object" : function(prefix, key) { emit(prefix, key); }
	});
}
