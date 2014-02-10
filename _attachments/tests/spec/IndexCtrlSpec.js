describe("my test suite", function() {

    beforeEach(module("filecabinet.controllers"));

    var $scope, $httpBackend, createController;

    beforeEach(inject(function($injector) {
        $scope = $injector.get("$rootScope").$new();
        $httpBackend = $injector.get("$httpBackend");

        var $controller = $injector.get("$controller");

        createController = function() {
            return $controller("IndexCtrl", {
                "$scope": $scope
            });
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    var prepareForTagLoad = function() {
        $httpBackend
            .expect("GET", "/filecabinet/_design/ui/_view/tags?group=true")
            .respond({ rows: [
                { key: "first name" },
                { key: "second name" }
            ]});
    };

    it("should load tags on startup", function() {
        prepareForTagLoad();
        $scope.$apply(function() { createController(); });
        expect($scope.tags).toEqual([]);
        $httpBackend.flush();
        expect($scope.tags).toEqual([
            { name: "first name", show: false },
            { name: "second name", show: false }
        ]);
    });

    it("should affect visiblity of all tags", function() {
        prepareForTagLoad();
        $scope.$apply(function() { createController(); });
        $httpBackend.flush();

        $scope.showAllTags(true);
        $scope.tags.forEach(function(e){ expect(e.show).toBe(true); });

        $scope.showAllTags(false);
        $scope.tags.forEach(function(e){ expect(e.show).toBe(false); });
    });
});
