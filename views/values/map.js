function(doc) {
    if (doc.type == "event") {
        require('views/lib/helperFunctions').processNode(doc.data, {
            "array" : function(prefix, values) {
                for (var i in values) {
                    emit([prefix, values[i]], 1);
                }
            },
            "value" : function(prefix, value) { emit([prefix, value], 1); }
        });
    }
}
