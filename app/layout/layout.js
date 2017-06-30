(function () {
    'use strict';

    angular
        .module('layout')
        .controller('Layout', Layout);

    function Layout($state, exportExcelService) {
        var vm = this;

        vm.showSideMenu = false;
        vm.goPublicas = goPublicas;
        vm.goHome = goHome;
        vm.goEventos = goEventos;
        vm.goRendiciones = goRendiciones;
        vm.goAnular = goAnular;
        vm.goGastos = goGastos;
        vm.goReportes = goReportes;
        vm.backupData = backupData;
        vm.restoreData = restoreData;

        activate();

        function activate() {
        }

        function goPublicas() {
            $state.go('layout.publicas');
        }

        function goHome() {
            $state.go('layout.home');
        }

        function goEventos() {
            $state.go('layout.eventos');
        }

        function goGastos() {
            $state.go('layout.gastos');
        }

        function goRendiciones() {
            $state.go('layout.rendiciones');
        }

        function goReportes() {
            $state.go('layout.reportes');
        }

        function goAnular() {
            $state.go('layout.anular');
        }

        function backupData() {
            var chooser = document.querySelector('#fileDialog');
            chooser.addEventListener("change", function (evt) {
                exportExcelService.backup(this.value);
            });

            chooser.click();
        }

        function restoreData() {
            var chooser = document.querySelector('#fileDirectory');
            chooser.addEventListener("change", function (evt) {
                exportExcelService.restore(this.value);
                document.location.reload(true);
            });

            chooser.click();

        }
    }

})();