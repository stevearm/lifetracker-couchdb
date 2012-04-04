function(newDoc, oldDoc, userCtx) {
	// Helper functions
	var fail = function(message) { throw({"forbidden":message}); };
	
	// Don't validate a deletion request
	if (newDoc._deleted) { return; }
	
	if (!("type" in newDoc)) { fail("Documents must have a type"); }
	switch (newDoc.type) {
		case "event":
			if ( !("when" in newDoc) || !("utc" in newDoc.when)
				|| !("local" in newDoc.when) || !("offset" in newDoc.when) ) {
				fail("Events must have utc, local and offset fields in when");
			}
			if (!Array.isArray(newDoc.when.local) || newDoc.when.local.length != 5) {
				fail("when.local must be a 5 element array");
			}
			if (typeof(newDoc.when.utc) != "number") {
				fail("when.utc must be an integer");
			}
			if (typeof(newDoc.when.offset) != "number") {
				fail("when.offset must be an integer");
			}
			break;
		default:
			fail("Unsupported document type: "+newDoc.type);
	}
}