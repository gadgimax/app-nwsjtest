(function () {
    'use strict';

    angular
        .module('reporte')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.reportes',
                config: {
                    name: 'reportes',
                    url: '/reportes',
                    templateUrl: 'app/reporte/reporte.html',
                    controller: 'Reporte',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();