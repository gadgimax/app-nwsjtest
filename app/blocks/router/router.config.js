(function () {
    'use strict';

    angular.module('blocks.router')
        .run(appRun)
        .config(config);

    function appRun($rootScope, logger) {
        //Additional events that can be used:
        //$stateNotFound 
        //$viewContentLoading - $viewContentLoaded 
        //Error handling and logging.
        $rootScope.$on('$stateChangeStart', handleStateChangeStart);
        $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess);
        $rootScope.$on('$stateChangeError', handleStateChangeError);

        function handleStateChangeStart(event, toState, toParams, fromState, fromParams) {
            // var requireLogin = toState.data.requireLogin;

            //TODO: Remove this
            if ($rootScope.globals) {
                if (requireLogin && !$rootScope.globals.currentUser) {
                    event.preventDefault();
                    $rootScope.$state.go('login', { redirect: true });
                }
            }
            logger.success('Starting navigation from ' + fromState.name, ' to ' + toState.name);
        }

        function handleStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            logger.success('Navigating from ' + fromState.name, ' to ' + toState.name);
        }

        function handleStateChangeError(event, toState, toParams, fromState, fromParams, error) {
            logger.error('Navigating from ' + fromState.name, ' to ' + toState.name);
        }

    }

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/pagenotfound');

    }
})();