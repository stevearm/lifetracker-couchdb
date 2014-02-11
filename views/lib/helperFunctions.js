exports.processNode = function(node, handlers) {
    var processNode = function(prefix, node, handlers) {
        if (Array.isArray(node)) {
            if (handlers.array) { handlers.array(prefix, node); }
            return;
        }
        if (typeof(node) !== "object") {
            if (handlers.value) { handlers.value(prefix, node); }
            return;
        }
        for (var key in node) {
            if (handlers.object) { handlers.object(prefix, key); }
            processNode( (prefix === null) ? key : prefix + "." + key, node[key], handlers);
        }
    };
    processNode(null, node, handlers);
};
