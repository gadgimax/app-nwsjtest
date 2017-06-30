(function () {
    'use strict';

    angular.module('app')
        .run(appRun);

    function appRun($rootScope, $state, $stateParams, $cookieStore) {
        //We have $state and $stateParams in any $scope.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDJV6P02k_PaE7UDJkK0PMCqIorNsH9gog",
            authDomain: "rpcrendiciones.firebaseapp.com",
            databaseURL: "https://rpcrendiciones.firebaseio.com",
            storageBucket: "rpcrendiciones.appspot.com",
            messagingSenderId: "798154877341"
        };
        firebase.initializeApp(config);
        
        //Check for previous logged in user
        //TODO: This how is done in http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx
        //But I don't like it, this should be done by the AuthenticationService
        $rootScope.globals = $cookieStore.get('globals') || {};

    }

})();