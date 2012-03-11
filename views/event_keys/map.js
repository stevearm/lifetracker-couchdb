function(doc) {
	for (var key in doc) {
		if (key.indexOf('_') != 0) { continue; }
		emit(null, key);
		if (typeof(doc[key]) === 'object') {
			for (var key2 in doc[key]) {
				emit(key,key2);
			}
		}
	}
}
