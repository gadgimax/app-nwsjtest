(function () {
    'use strict';

    angular
        .module('home')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.home',
                config: {
                    url: '^',
                    templateUrl: 'app/home/home.html',
                    controller: 'Home',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();