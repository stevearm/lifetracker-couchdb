function(doc) {
	if (doc.when.utc) {
		emit(doc.when.utc, doc);
	}
};
