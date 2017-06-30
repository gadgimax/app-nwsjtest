angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
    this.$get = RouterHelper;


    //For NWJS applications, html5 is not supported.
     $locationProvider.html5Mode(false);

    function RouterHelper($state) {
        var hasOtherwise = false;

        var service = {
            configureStates: configureStates,
            getStates: getStates
        };

        return service;

        ///////////////

        function configureStates(states, otherwisePath) {
            states.forEach(function(state) {
                $stateProvider.state(state.state, state.config);
            });
            if (otherwisePath && !hasOtherwise) {
                hasOtherwise = true;
                $urlRouterProvider.otherwise(otherwisePath);
            }

        }

        function getStates() { return $state.get(); }
    }
}