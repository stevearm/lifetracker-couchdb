"use strict";

var exports = {};

/**
 * This module exists only to capture the functions exported by any code shared with db-side views.
 * It should be loaded before loading the shared js code
 */
angular.module("couchdb.exports", []).factory("ExportedFunctions", [
    function() {
        return function() {
            return exports;
        };
    }
]);