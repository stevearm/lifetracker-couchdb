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
]);
