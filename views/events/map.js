function(doc) {
	if (doc.when) {
		emit(new Date(doc.when).getTime(), doc);
	}
};
