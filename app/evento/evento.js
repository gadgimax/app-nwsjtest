(function () {
    'use strict';

    angular
        .module('evento')
        .controller('Evento', Evento);

    function Evento($state, $stateParams, eventoService) {
        var vm = this;

        vm.dateOptions = {
            format: 'dd-MM-yyyy'
        }

        vm.isNew = $stateParams.isNew;
        vm.evento = $stateParams.evento || {};

        vm.saveEvento = saveEvento;
        vm.goEventos = goEventos;

        activate();

        function activate() {
            if (!vm.evento.precios || !vm.evento.precios.length) {
                vm.evento.precios = [];
            }
        }


        function saveEvento() {
            delete vm.evento.$$treeLevel;

            vm.evento.precios.forEach(function (ev) { delete ev.$$treeLevel });
            if (vm.isNew) {
                eventoService.save(angular.copy(vm.evento));
            } else {
                eventoService.update(angular.copy(vm.evento));
            }

            goEventos();
        }

        function goEventos() {
            $state.transitionTo('layout.eventos');
        }

    }
})();
