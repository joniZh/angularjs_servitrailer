var app = angular.module('appTransporte', ['angucomplete-alt','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','toaster']);/*,'ngLoadingSpinner'*/

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'index/orders_send',
            // templateUrl: 'index/viewOrdenEnvio',
            controller: 'order_send'
        })
      
        .when('/new_order', {
            templateUrl: 'index/new_order',
            controller: 'new_order'
        })
        .when('/orders_exit', {
            templateUrl: 'index/orders_exit',
            controller: 'orders_exit'
        })
        .when('/client', {
            templateUrl: 'index/client',
            controller: 'liquidation_client'
        })
        .when('/transport', {
            templateUrl: 'index/transport',
            controller: 'liquidation_carrier'
        })
        .when('/login', {
            templateUrl: 'index/load_login',
        })
        .when('/edit_comanda/:comanda_id', {
              templateUrl: function(params) {
                var url_complete = 'index/load_edit_comanda/'+params.comanda_id;
                return url_complete;
            },
            controller: 'editComandaCtrl'
        })
        .otherwise({ redirectTo: '/' });
});