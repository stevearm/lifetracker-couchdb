function(doc) {
	function processNode(prefix, node) {
		if (Array.isArray(node)) {
			for (var i in node) {
				emit([prefix, node[i]], 1);
			}
			return;
		}
		if (typeof(node) !== 'object') {
			emit([prefix, node], 1);
			return;
		}
		for (var key in node) {
			if (key.indexOf('_') == 0) { continue; }
			if (key == 'when') { continue; }
			processNode( (prefix === null)?key:prefix+"."+key, node[key]);
		}
	}
	
	processNode(null, doc);
}
