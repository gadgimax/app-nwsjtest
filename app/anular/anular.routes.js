(function () {
    'use strict';

    angular
        .module('anular')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.anular',
                config: {
                    name: 'anular',
                    url: '/anular',
                    templateUrl: 'app/anular/anular.html',
                    controller: 'Anular',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();