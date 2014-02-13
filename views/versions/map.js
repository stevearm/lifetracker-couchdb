function(doc) {
    var version = doc.version;
    if (typeof(version) === "undefined") {
        version = 0;
    }
    emit([doc.type, version], null);
}
