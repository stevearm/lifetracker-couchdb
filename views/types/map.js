function(doc) {
    if (doc.type == "event") {
        require('views/lib/helperFunctions').processNode(doc.data, {
            "array" : function(prefix, values) { emit(prefix, "array"); },
            "value" : function(prefix, value) { emit(prefix, typeof(value)); }
        });
    }
}
