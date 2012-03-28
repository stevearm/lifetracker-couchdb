function(doc) {
	// !code _attachments/script/helpers/walkNodes.js
	
	processNode(null, doc, {
		"array" : function(prefix, values) { emit(prefix, "array"); },
		"value" : function(prefix, value) { emit(prefix, typeof(value)); }
	});
}