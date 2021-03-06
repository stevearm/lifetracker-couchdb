"use strict";

angular.module("lifetracker", [
    "ngRoute",
    "ngResource",
    "ui.bootstrap",
    "couchdb.exports",
    "lifetracker.controllers",
    "lifetracker.directives",
    "lifetracker.factories",
    "lifetracker.services"
])

.config([
    "$routeProvider",
    function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl:    "partials/list.html",
            controller:     "ListCtrl"
        })
        .when("/add", {
            templateUrl:    "partials/event.html",
            controller:     "EventCtrl"
        })
        .when("/event/:id", {
            templateUrl:    "partials/event.html",
            controller:     "EventCtrl"
        })
        .when("/migrate", {
            templateUrl:    "partials/migrate.html",
            controller:     "MigrateCtrl"
        })
        .otherwise({redirectTo: "/"});
    }
]);
