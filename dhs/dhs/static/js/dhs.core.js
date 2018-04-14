var dhsApp = angular.module("dhsApp", ["ngRoute"])


dhsApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/products', {
        templateUrl: 'products',
        controller: 'productsCtrl'
    })
    .when('/second_msg', {
        templateUrl: 'second_msg',
        controller: 'message2'
    })

}]);

dhsApp.controller('productsCtrl', ['$scope', function($scope) {
}]);

dhsApp.controller('message2', ['$scope', function($scope) {
}]);
