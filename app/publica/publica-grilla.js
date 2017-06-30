(function () {
    'use strict';

    angular
        .module('publica')
        .controller('PublicaGrilla', PublicaGrilla);

    function PublicaGrilla($state, publicaService) {
        var vm = this;

        vm.addPublica = addPublica;
        vm.editPublica = editPublica;
        vm.deletePublica = deletePublica;
        vm.publicas = [];

        vm.gridOptions = {
            appScopeProvider: vm,
            enableSorting: true,
            columnDefs: [
                { name: 'nombre', field: 'nombre', enableCellEdit: false, enableColumnMenu: false },
                { name: 'idCard', field: 'idCard', enableCellEdit: false, enableColumnMenu: false },
                {
                    name: 'Controles', enableColumnMenu: false, width: 100,
                    cellTemplate: '<button type="button" ng-click="grid.appScope.editPublica(row.entity)" class="btn btn-default"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button><button type="button" ng-click="grid.appScope.deletePublica(row.entity)" class="btn btn-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'
                }
            ],
            data: vm.publicas
        };

        activate();

        function activate() {
            getPublicas();
        }

        function getPublicas() {
            publicaService.get().then(function (data) {
                vm.publicas.length = 0;
                vm.publicas.push.apply(vm.publicas, data);
            });
        }

        function addPublica() {
            goToPublica(true, null);
        }

        function editPublica(publica) {
            goToPublica(false, publica);
        }

        function deletePublica(publica) {
            if (confirm("Se va a borrar un publica, está seguro?")) {
                publicaService.delete(publica);
                $state.go($state.current, {}, { reload: true });
            }
        }

        function goToPublica(isNew, publica) {
            $state.transitionTo('layout.publica', { isNew: isNew, publica: publica });
        }
    }

})();
