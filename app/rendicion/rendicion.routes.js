(function () {
    'use strict';

    angular
        .module('rendicion')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.rendiciones',
                config: {
                    name: 'rendiciones',
                    url: '/rendicion',
                    templateUrl: 'app/rendicion/rendicion.html',
                    controller: 'Rendicion',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'layout.rendicionesHome',
                config: {
                    name: 'rendicionesHome',
                    params: {
                        evento:null,
                        publica:null
                    },
                    url: '/rendicionesHome',
                    templateUrl: 'app/rendicion/rendicion.html',
                    controller: 'Rendicion',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();