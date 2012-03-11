function(doc) {
	function processNode(prefix, node) {
		if (typeof(node) !== 'object' || Array.isArray(node)) { return; }
		for (var key in node) {
			if (key.indexOf('_') == 0) { continue; }
			emit(prefix, key);
			processNode( (prefix === null)?key:prefix+"."+key, node[key]);
		}
	}
	
	processNode(null, doc);
}
