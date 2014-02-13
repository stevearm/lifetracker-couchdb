"use strict";

angular.module("lifetracker.services", [])

.service("CouchService", [
    function() {
        this.currentDb = function() {
            return document.location.pathname.split("/")[1];
        };
        this.currentDesignDoc = function() {
            return document.location.pathname.split("/")[3];
        };
        this.viewUrl = function(that) {
            return function(viewName, designDocId) {
                if (!viewName) {
                    return "";
                }
                if (!designDocId) {
                    designDocId = that.currentDesignDoc();
                }
                return "/" + that.currentDb() + "/_design/" + designDocId + "/_view/" + viewName;
            };
        }(this);
        this.listUrl = function(that) {
            return function(listName, viewName, designDocId) {
                if (!listName || !viewName) {
                    return "";
                }
                if (!designDocId) {
                    designDocId = that.currentDesignDoc();
                }
                return "/" + that.currentDb() + "/_design/" + designDocId + "/_list/" + listName + "/" + viewName;
            };
        }(this);
    }
])

.service("DateUtils", [
    function() {
        this.toLocalIso8601 = function(date) {
            function pad(num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            }

            var tzo = -date.getTimezoneOffset();
            var sign = tzo >= 0 ? '+' : '-';
            return date.getFullYear()
                + '-' + pad(date.getMonth()+1)
                + '-' + pad(date.getDate())
                + 'T' + pad(date.getHours())
                + ':' + pad(date.getMinutes())
                + ':' + pad(date.getSeconds())
                + sign + pad(tzo / 60)
                + ':' + pad(tzo % 60);
        };
    }
])

.service("MigrationService", [
    function() {
        // Migration function definitions
        var migrators = {
            event: [
                function(doc) {
                    if ("version" in doc) {
                        throw "Version 0 did not specify versions";
                    }

                    // Manually fix 'when'
                    function pad(num) {
                        var norm = Math.abs(Math.floor(num));
                        return (norm < 10 ? '0' : '') + norm;
                    }
                    doc.when = doc.when.local[0] + "-"
                        + pad(doc.when.local[1]) + "-"
                        + pad(doc.when.local[2]) + "T"
                        + pad(doc.when.local[3]) + ":"
                        + pad(doc.when.local[4]) + "-"
                        + pad(doc.when.offset / 60) + "00";

                    // Move all other data
                    var data = {};
                    for (var key in doc) {
                        if (key.charAt(0) == "_") { continue; }
                        if (key == "type") { continue; }
                        if (key == "when") { continue; }
                        data[key] = doc[key];
                        delete doc[key];
                    }
                    doc.data = data;

                    // Set version
                    doc.version = 1;
                }
            ]
        };

        this.currentVersion = function(type) {
            return migrators[type].length;
        }
        this.migrator = function(type, version) {
            return migrators[type][version];
        }
        this.migrate = function(doc) {
            var version = doc.version || 0;
            var fix = this.migrator(doc.type, version);
            if (fix) {
                fix(doc);
                return true;
            }
            return false;
        }
    }
]);
