function(doc) {
	// !code _attachments/script/helpers/walkNodes.js
	
	processNode(null, doc, {
		"array" : function(prefix, values) {
			for (var i in values) {
				emit([prefix, values[i]], 1);
			}
		},
		"value" : function(prefix, value) { emit([prefix, value], 1); }
	});
}
