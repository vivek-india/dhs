var dhsApp = angular.module("dhsApp", ["ngRoute"])


dhsApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/products', {
        templateUrl: 'products',
        controller: 'productsCtrl'
    })
    .when('/sale', {
        templateUrl: 'sale',
        controller: 'saleCtrl'
    })
    .when('/purchase', {
        templateUrl: 'purchase',
        controller: 'purchaseCtrl'
    })

}]);

dhsApp.controller('productsCtrl', ['$scope', function($scope) {
}]);

dhsApp.controller('saleCtrl', ['$scope', function($scope) {
}]);

dhsApp.controller('purchaseCtrl', ['$scope', function($scope) {
}]);
