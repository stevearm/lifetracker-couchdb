"use strict";

angular.module("lifetracker.factories", [])

.factory("Event", [
    "$resource", "$http", "CouchService",
    function($resource, $http, CouchService) {
        var db = "/" + CouchService.currentDb() + "/"
        var Event = $resource(db + ":id", { id:"@_id", rev:"@_rev"}, {
            delete: {
                method: "DELETE",
                url: db + ":id?rev=:rev"
            }
        });

        Event.prototype.$save = function(callback) {
            if (!callback) { callback = function(){}; }

            // Push to server
            var config = { data: this, method: "POST", url: db };
            if ("_id" in this) {
                config.method = "PUT";
                config.url += this._id;
            }
            $http(config).error(function(data, status, headers, config) {
                console.log("Error saving", data, status, headers, config);
                window.alert("Error saving: " + data.reason);
            }).success(function(original_object){ return function(data, status, headers, config) {
                original_object._id = data.id;
                original_object._rev = data.rev;
                callback();
            };}(this));
        };

        return Event;
    }
]);
