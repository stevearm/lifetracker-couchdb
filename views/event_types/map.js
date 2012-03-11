function(doc) {
	function processNode(prefix, node) {
		var type = typeof(node);
		if (type === 'object' && Array.isArray(node)) { type = 'array'; }
		emit(prefix, type);
		if (type === 'object') {
			for (var key in node) {
				if (key.indexOf('_') == 0) { continue; }
				processNode( (prefix === null)?key:prefix+"."+key, node[key]);
			}
		}
	}
	
	processNode(null, doc);
}
