(function () {
    'use strict';

    angular
        .module('reporte')
        .controller('Reporte', Reporte);

    function Reporte(exportExcelService, eventoService) {
        var vm = this;

        //Functions
        vm.exportar = exportar;
        vm.diarios = diarios;

        //Private vars
        vm.eventos = [];

        activate();

        function activate() {
            getEventos();
        }

        function getEventos() {
            eventoService.get().then(function (data) {
                vm.eventos.length = 0;
                vm.eventos.push.apply(vm.eventos, data);
            });
        }

        function exportar() {
            var eventsToExport = [];
            vm.eventos.forEach(function (evento) {
                if (evento.incluir) {
                    eventsToExport.push(evento);
                }
            });
            var chooser = document.querySelector('#fileDialog2');
            chooser.addEventListener("change", function (evt) {
                exportExcelService.pepe(this.value, eventsToExport);
            }, false);

            chooser.click();
        }

        function diarios() {
            var eventsToExport = vm.eventos;
            var chooser = document.querySelector('#fileDialogDiario');
            chooser.addEventListener("change", function (evt) {
                exportExcelService.pepe2(this.value, eventsToExport,vm.fechaReporte);
            }, false);

            chooser.click();
        }
    }
})();
