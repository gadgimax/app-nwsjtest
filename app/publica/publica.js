(function () {
    'use strict';

    angular
        .module('publica')
        .controller('Publica', Publica);

    function Publica($state, $stateParams, publicaService) {
        var vm = this;

        vm.isNew = $stateParams.isNew;
        vm.publica = $stateParams.publica;
        vm.savePublica = savePublica;
        vm.goPublicas = goPublicas;

        activate();

        function activate() {
        }

        function savePublica() {
            if (vm.isNew) {
                publicaService.save(angular.copy(vm.publica));
            } else {
                publicaService.update(angular.copy(vm.publica));
            }

            goPublicas();
        }

        function goPublicas() {
            $state.transitionTo('layout.publicas');
        }
    }

})();
