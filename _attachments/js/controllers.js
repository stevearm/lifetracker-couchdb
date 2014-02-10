"use strict";

angular.module("lifetracker.controllers", [])

.controller("ListCtrl", [
    "$scope", "$http", "CouchService", "ExportedFunctions",
    function($scope, $http, CouchService, ExportedFunctions) {

        function fill(number) {
            if (number <= 9) { return "0"+number; }
            return ""+number;
        }

        $scope.events = $http
            .get(CouchService.viewUrl("events") + "?descending=true&limit=10&update_seq=true")
            .then(function(res){ return res.data.rows.map(function(r) {
                var when = r.value.when.local;
                delete r.value.when;

                var result = {
                    id: r.value._id,
                    when: when[0]+"-"+when[1]+"-"+when[2]+" @"+fill(when[3])+":"+fill(when[4]),
                    properties: []
                };
                ExportedFunctions().processNode(null, r.value, {
                    "array" : function(prefix, node) {
                        result.properties.push({"key":prefix, "value":"[ "+node.join(", ")+" ]"}); 
                    },
                    "value" : function(prefix, node) { result.properties.push({"key":prefix, "value":node}); }
                });
                result.properties.sort(function(a, b) {
                    return a.key.toLowerCase() > b.key.toLowerCase()
                });
                return result;
            });
        });
    }
])

.controller("AddCtrl", [
    "$scope", "$http", "CouchService", "DateUtils",
    function($scope, $http, CouchService, DateUtils) {
        $scope.day = new Date();
        $scope.time = new Date();

        $scope.when = function() {
            var day = DateUtils.toLocalIso8601($scope.day);
            var time = DateUtils.toLocalIso8601($scope.time);
            console.log("Combining", day, time);
            var merged = day.substring(0, day.indexOf("T"))
                + time.substring(time.indexOf("T"));
            console.log("Combined", merged);
            return new Date(
                merged
            );
        }

        var types = {};

        $scope.keys = $http.get(CouchService.viewUrl("types") + "?group=true").then(function(res) {
            return res.data.rows.map(function(r){
                types[r.key] = r.value;
                return r.key;
            });
        });

        $scope.getValues = function(key) {
            return $http
                .get(CouchService.viewUrl("values") + "?group=true&startkey=[\"" + key + "\"]&endkey=[\"" + key + "\",{}]")
                .then(function(res) {
                    return res.data.rows.map(function(r) {
                        return r.key[1];
                    });
                });
        };
    }
]);
