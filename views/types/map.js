function(doc) {
    require('views/lib/helperFunctions').processNode(null, doc, {
        "array" : function(prefix, values) { emit(prefix, "array"); },
        "value" : function(prefix, value) { emit(prefix, typeof(value)); },
        "testing": function(message) { emit(null, message); }
    });
}
