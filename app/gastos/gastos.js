(function () {
    'use strict';

    angular
        .module('gastos')
        .controller('Gastos', Gastos);

    function Gastos($state, $stateParams, rendicionService) {
        var vm = this;
        vm.gasto = {};
        vm.rendicion = {};
        vm.rendGastos = [];
        vm.deleteRendicion=deleteRendicion;
        vm.gridOptions = {
            appScopeProvider: vm,
            enableSorting: true,
            columnDefs: [
                { name: 'Nombre', field: 'detalle', enableCellEdit: false, enableColumnMenu: false },
                { name: 'Monto', field: 'montoTotal', enableCellEdit: false, enableColumnMenu: false },
                {
                    name: 'Controles', enableColumnMenu: false, width: 100,
                    cellTemplate: '<button type="button" ng-click="grid.appScope.deleteRendicion(row.entity)" class="btn btn-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'
                }
            ],
            data: vm.rendGastos
        };
        vm.gogastos = goGastos;
        vm.save = guardarRendicion;

        activate();

        function activate() {
            rendicionService.getGastos().then(function (data) {
                vm.rendGastos.length = 0;
                vm.rendGastos.push.apply(vm.rendGastos, data);
            });
            rendicionService.getGastos();
        }

        function guardarRendicion(evento) {
            vm.rendicion.fecha = new Date();
            vm.rendicion.montoTotal = vm.gasto.monto;
            vm.rendicion.descripcion = 'Gastos';
            vm.rendicion.detalle = vm.gasto.desc;
            vm.rendicion.dama=0;
            vm.rendicion.general=0;
            vm.rendicion.vip_gold=0;
            vm.rendicion.vip=0;
            vm.rendicion.publica = {
                nombre: 'GASTOS',
                id: 'GASTOS'
            };
            vm.rendicion.evento = {
                nombre: 'GASTOS',
                id: 'GASTOS'
            };
            rendicionService.save(vm.rendicion);
            vm.gasto = {};
            activate();
        }

        function deleteRendicion(rendi) {
            if (confirm("Desea borrar este gasto?")) {
                rendicionService.delete(rendi).then(function (data) {
                    activate();
                });
            }
        }

        function goGastos() {
            $state.transitionTo('layout.gastos');
        }
    }

})();
