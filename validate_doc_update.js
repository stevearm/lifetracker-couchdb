function(newDoc, oldDoc, userCtx) {
	// Don't validate a deletion request
    if (newDoc._deleted) { return; }

    // Helper functions
    var fail = function(message) { throw({"forbidden":message}); };
    
    if (!newDoc.type) { fail("Documents must have a type"); }
    switch (newDoc.type) {
        case "event":
        	if (!newDoc.version) { fail("Events must specify a schema version"); }
            if (!newDoc.when) { fail("Events must have an ISO8601 timestamp as 'when'"); }
            if (!newDoc.data) { fail("Events must specify some kind of data"); }
            break;
        default:
            fail("Unsupported document type: "+newDoc.type);
    }
}
