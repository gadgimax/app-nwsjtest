(function () {
    'use strict';

    angular
        .module('evento')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.eventos',
                config: {
                    name: 'eventos',
                    url: '/eventos',
                    templateUrl: 'app/evento/evento-grilla.html',
                    controller: 'EventoGrilla',
                    controllerAs: 'vm'
                }
            }, {
                state: 'layout.evento',
                config: {
                    name: 'evento',
                    url: '/eventos/evento',
                    params: {
                        isNew: null,
                        evento: null
                    },
                    templateUrl: 'app/evento/evento.html',
                    controller: 'Evento',
                    controllerAs: 'vm'
                }
            }
        ];
    }

})();