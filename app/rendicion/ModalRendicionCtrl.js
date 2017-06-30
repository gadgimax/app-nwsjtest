(function () {
    'use strict';

    angular
        .module('rendicion')
        .controller('ModalRendicionCtrl', ModalRendicionCtrl);

    function ModalRendicionCtrl($uibModalInstance, rendicion) {
        var vm = this;
        vm.rendicion = rendicion;
        vm.individual = false;

        vm.ok = function () {
            vm.rendicion.numDama = [];
            vm.rendicion.numGeneral = [];
            vm.rendicion.numVip = [];
            vm.rendicion.numVipGold = [];
            if (!vm.individual) {
                vm.rendicion.numDama = { desde: vm.damaDesde, hasta: vm.damaHasta };
                vm.rendicion.numGeneral = { desde: vm.gralDesde, hasta: vm.gralHasta };
                vm.rendicion.numVip = { desde: vm.vipDesde, hasta: vm.vipHasta };
                vm.rendicion.numVipGold = { desde: vm.goldDesde, hasta: vm.goldHasta };
            }
            else {
                if (vm.damaIndividual) vm.rendicion.numDama = { indList: vm.splitInt(vm.damaIndividual) };
                if (vm.gralIndividual) vm.rendicion.numGeneral = { indList: vm.splitInt(vm.damaIndividual) };
                if (vm.vipIndividual) vm.rendicion.numVip = { indList: vm.splitInt(vm.damaIndividual) };
                if (vm.goldIndividual) vm.rendicion.numVipGold = { indList: vm.splitInt(vm.damaIndividual) };
            }
            $uibModalInstance.close(vm.rendicion);
        };

        vm.splitInt = function (cadena) {
            var aux = cadena.split(' ');
            aux = aux.filter(palabra => !(palabra === ""));
            return aux.map(function (obj) {
                return Number(obj);
            });
        }

        vm.fillHasta = function (ticketType) {
            if (ticketType === 'dama') vm.damaHasta = vm.damaDesde + vm.rendicion.dama - 1;
            else if (ticketType === 'general') vm.gralHasta = vm.gralDesde + vm.rendicion.general - 1;
            else if (ticketType === 'vip') vm.vipHasta = vm.vipDesde + vm.rendicion.vip - 1;
            else vm.goldHasta = vm.goldDesde + vm.rendicion.vip_gold - 1;
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();