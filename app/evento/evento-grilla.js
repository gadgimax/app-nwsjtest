(function () {
    'use strict';

    angular
        .module('evento')
        .controller('EventoGrilla', EventoGrilla);

    function EventoGrilla($state, eventoService, exportExcelService) {
        var vm = this;

        vm.addEvento = addEvento;
        vm.viewAll = false;
        vm.editEvento = editEvento;
        vm.eventos = [];
        vm.setDateFilter = setDateFilter;
        vm.exportar = exportar;
        vm.charge=charge;

        vm.gridOptions = {
            appScopeProvider: vm,
            enableSorting: true,
            showTreeExpandNoChildren: false,
            columnDefs: [{
                    name: 'nombre',
                    field: 'nombre',
                    enableColumnMenu: false
                }, {
                    name: 'fecha',
                    field: 'fecha',
                    type: 'date',
                    cellFilter: 'date:\'dd-MM-yyyy\'',
                    enableColumnMenu: false
                }, {
                    name: 'lugar',
                    field: 'lugar',
                    enableColumnMenu: false
                }, {
                    name: 'precio_dama',
                    field: 'precio_dama',
                    enableColumnMenu: false
                }, {
                    name: 'precio_general',
                    field: 'precio_general',
                    enableColumnMenu: false
                }, {
                    name: 'precio_vip',
                    field: 'precio_vip',
                    enableColumnMenu: false
                }, {
                    name: 'precio_vip_gold',
                    field: 'precio_vip_gold',
                    enableColumnMenu: false
                }, {
                    name: 'Editar',
                    enableColumnMenu: false,
                    width: 80,
                    cellTemplate: 
                    '<button type="button" ng-click="grid.appScope.editEvento(row.entity)" ng-if="row.entity.lugar" class="btn btn-default"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'
                    //<button type="button" ng-click="grid.appScope.charge(row.entity)" ng-if="row.entity.lugar" class="btn btn-default"><span class="glyphicon glyphicon-fire" aria-hidden="true"></span></button>
                }

            ],
            data: vm.eventos
        };

        activate();

        function activate() {
            getEventos();
        }

        function charge(data) {
            var aux = data.anuladas;
            vm.anuladas=aux;
            textareaEdit.value=aux.join(', ');
        }

        function getEventos(aDate) {
            eventoService.get(aDate).then(function (data) {
                vm.eventos.length = 0;
                var formattedArray = [];
                data.forEach(function (evento) {
                    evento.$$treeLevel = 0;
                    formattedArray.push(evento);
                    if (evento.precios) {
                        evento.precios.forEach(function (precio) {
                            precio.$$treeLevel = 1;
                            formattedArray.push(precio);
                        });
                    }
                });

                vm.eventos.push.apply(vm.eventos, formattedArray);
            });
        }

        function setDateFilter() {
            vm.viewAll = !vm.viewAll;
            var theDate = undefined;
            if (vm.viewAll) {
                theDate = new Date();
                theDate.setDate(theDate.getDate() - 365 * 3);
            }
            getEventos(theDate);
        }

        function addEvento() {
            goToEvento(true, null);
        }

        function editEvento(evento) {
            goToEvento(false, evento);
        }

        function goToEvento(isNew, evento) {
            $state.transitionTo('layout.evento', {
                isNew: isNew,
                evento: evento
            });
        }

        function exportar() {
            chooseFile('#fileDialog2');
        }


        function chooseFile(name) {
            var chooser = document.querySelector(name);
            chooser.addEventListener("change", function (evt) {
                exportExcelService.pepe(this.value);
            }, false);

            chooser.click();
        }
    }
})();