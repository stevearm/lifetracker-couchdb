"use strict";

angular.module("lifetracker.factories", [])

.factory("Document", [
    "$resource", "$http", "CouchService",
    function($resource, $http, CouchService) {
        var db = "/" + CouchService.currentDb() + "/"
        var Document = $resource(db + ":id", { id:"@_id", rev:"@_rev"}, {
            delete: {
                method: "DELETE",
                url: db + ":id?rev=:rev"
            }
        });

        Document.prototype.thumbs = function() {
            if (!this._attachments) {
                    return [];
            }
            var thumbnailPrefix = "thumb/";
            var thumbs = [];
            for (var name in this._attachments) {
                if (name.substring(0, thumbnailPrefix.length) == thumbnailPrefix) {
                    thumbs.push(name);
                }
            }
            return thumbs;
        };

        Document.prototype.deleteUnusedThumbs = function() {
            // Delete any thumbnails that are not selected
            var thumbnail = this.thumbnail;
            var attachments = this._attachments;
            this.thumbs().forEach(function(e) {
                if (thumbnail != e) {
                    delete attachments[e];
                }
            });
        };

        Document.prototype.$save = function(callback) {
            if (!callback) { callback = function(){}; }
            this.deleteUnusedThumbs();

            // Scrub any objects into strings to prepare for save
            if (this.effective instanceof Date) {
                this.effective = this.effective.toISOString();
            }

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
                original_object._rev = data.rev;
                callback();
            };}(this));
        };

        return Document;
    }
]);
