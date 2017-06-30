(function () {
    'use strict';

    angular
        .module('publica')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.publicas',
                config: {
                    name: 'publicas',
                    url: '/publicas',
                    templateUrl: 'app/publica/publica-grilla.html',
                    controller: 'PublicaGrilla',
                    controllerAs: 'vm'
                }
            }, {
                state: 'layout.publica',
                config: {
                    name: 'publica',
                    url: '/publica',
                    params: {
                        isNew: null,
                        publica: null
                    },
                    templateUrl: 'app/publica/publica.html',
                    controller: 'Publica',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();