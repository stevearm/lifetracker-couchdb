"use strict";

angular.module("lifetracker.controllers", [])

.controller("ListCtrl", [
    "$scope", "$http", "CouchService", "ExportedFunctions",
    function($scope, $http, CouchService, ExportedFunctions) {
        $scope.events = [];
        $http
            .get(CouchService.viewUrl("events") + "?descending=true&limit=10&update_seq=true")
            .success(function(data) {
                $scope.events = data.rows.map(function(r) {
                var result = {
                    id: r.id,
                    when: r.value.when,
                    properties: []
                };
                ExportedFunctions().processNode(r.value.data, {
                    "array" : function(prefix, node) {
                        result.properties.push({"key":prefix, "value":"[ "+node.join(", ")+" ]"}); 
                    },
                    "value" : function(prefix, node) {
                        result.properties.push({"key":prefix, "value":node});
                    },
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
    "$scope", "$http", "$modal", "CouchService", "DateUtils", "Event",
    function($scope, $http, $modal, CouchService, DateUtils, Event) {
        $scope.day = new Date();
        $scope.time = new Date();
        $scope.event = new Event({
            type: "event",
            version: 1,
            when: DateUtils.toLocalIso8601(new Date()),
            data: {}
        });

        var updateTime = function() {
            var day = DateUtils.toLocalIso8601($scope.day);
            var time = DateUtils.toLocalIso8601($scope.time);
            $scope.event.when = day.substring(0, day.indexOf("T")) + time.substring(time.indexOf("T"));
        };
        $scope.$watch("day", updateTime);
        $scope.$watch("time", updateTime);

        var types = {};

        $scope.keys = [];
        $http.get(CouchService.viewUrl("types") + "?group=true").success(function(data) {
            $scope.keys = data.rows.map(function(r){
                types[r.key] = r.value;
                return r.key;
            });
        });

        $scope.getSuggestedValues = function(key) {
            return $http
                .get(CouchService.viewUrl("values") + "?group=true&startkey=[\"" + key + "\"]&endkey=[\"" + key + "\",{}]")
                .then(function(res) {
                    return res.data.rows.map(function(r) {
                        return r.key[1];
                    });
                });
        };

        var get = function(key) {
            var parts = key.split(".");
            var last = null;
            var model = $scope.event.data;
            for (var i = 0; i < parts.length; i++) {
                if (typeof(model) === "undefined") {
                    model = {};
                    last[parts[i-1]] = model;
                }
                last = model;
                model = model[parts[i]];
            }
            return model;
        };

        var set = function(key, value) {
            var parts = key.split(".");
            var last = null;
            var model = $scope.event.data;
            for (var i = 0; i < parts.length - 1; i++) {
                if (typeof(model) === "undefined") {
                    model = {};
                    last[parts[i-1]] = model;
                }
                last = model;
                model = model[parts[i]];
            }
            model[parts[parts.length-1]] = value;
        };

        var chooseDataType = function (key, value) {
            $modal.open({
                templateUrl: "partials/chooseDataTypeModal.html",
                controller: "ChooseDataTypeCtrl",
                resolve: {
                    key: function () { return key; }
                }
            }).result.then(function (selected) {
                $scope.addProperty(key, value, selected);
            });
        };

        $scope.addProperty = function(key, value, chosenType) {
            var type = types[key];
            if (typeof(type) === "undefined") {
                if (typeof(chosenType) === "undefined") {
                    chooseDataType(key, value);
                } else {
                    types[key] = chosenType;
                    $scope.addProperty(key, value);
                }
            } else {
                switch (type) {
                    case "array":
                        var array = get(key);
                        if (array == null) {
                            set(key, [value]);
                        } else {
                            array.push(value);
                        }
                        break;
                    case "number":
                        set(key, parseFloat(value));
                        break;
                    case "boolean":
                        set(key, values.toLowerCase() === "true");
                        break;
                    case "string":
                        set(key, value);
                        break;
                    default:
                        console.log("Unknown type", type);
                        break;
                }
            }
        };

        $scope.saveEvent = function() {
            $scope.event.$save();
        };

        $scope.deleteEvent = function() {
            $scope.event.$delete();
        };
    }
])

.controller("ChooseDataTypeCtrl", [
    "$scope", "$modalInstance", "key",
    function($scope, $modalInstance, key) {
        $scope.key = key;
        $scope.types = [ "array", "number", "boolean", "string" ];

        // No idea why this needs to be an object, but it does
        $scope.selected = { type: "string" };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.type);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };
    }
])

.controller("MigrateCtrl", [
    "$scope", "$http", "CouchService", "Event",
    function($scope, $http, CouchService, Event) {
        $scope.selectedGroup = null;
        $scope.groups = [];
        $http.get(CouchService.viewUrl("versions") + "?group=true").success(function(data) {
            $scope.groups = data.rows.map(function(r){
                return { type: r.key[0], version: r.key[1], count: r.value };
            });
            $scope.selectedGroup = $scope.groups[0];
        });

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

        $scope.currentDoc = null;
        $scope.loadOne = function () {
            if ($scope.selectedGroup != null) {
                $http.get(CouchService.viewUrl("versions")
                    + "?reduce=false&key=[\"" + $scope.selectedGroup.type + "\"," + $scope.selectedGroup.version
                    + "]&limit=1")
                .success(function(data) {
                    if (data.rows.length > 0) {
                        $scope.currentDoc = Event.get({ id: data.rows[0].id });
                    }
                });
            }
        };

        var noop = function() {};

        $scope.upgradeOne = function () {
            var fix = migrators[$scope.selectedGroup.type][$scope.selectedGroup.version] || noop;
            fix($scope.currentDoc);
        };

        $scope.upgradeBatch = function(num) {
            if ($scope.selectedGroup != null) {
                var fix = migrators[$scope.selectedGroup.type][$scope.selectedGroup.version];
                if (fix != null) {
                    var handler = function(doc) {
                        fix(doc);
                        doc.$save();
                    };
                    $http.get(CouchService.viewUrl("versions")
                        + "?reduce=false&key=[\"" + $scope.selectedGroup.type + "\"," + $scope.selectedGroup.version
                        + "]&limit=" + num)
                    .success(function(data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            Event.get({ id: data.rows[i].id }, handler);
                        }
                    });
                }
            }
        };
    }
]);
