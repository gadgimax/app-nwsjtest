(function () {
    'use strict';

    angular
        .module('gastos')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.gastos',
                config: {
                    name: 'gastos',
                    url: '/gastos',
                    templateUrl: 'app/gastos/gastos.html',
                    controller: 'Gastos',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();