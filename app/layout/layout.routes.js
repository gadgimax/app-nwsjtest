(function () {
    'use strict';

    angular
        .module('layout')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout',
                config: {
                    abstract: true,
                    templateUrl: 'app/layout/layout.html',
                    controller: 'Layout',
                    controllerAs: 'vm',
                    data: {
                        requireLogin: false //This will go to all child states
                    }
                }
            }
        ];
    }

})();