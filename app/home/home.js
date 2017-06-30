(function () {
    'use strict';

    angular
        .module('home')
        .controller('Home', Home);

    function Home(rendicionService, eventoService, $state) {
        var vm = this;

        vm.eventos = [];

        activate();

        function activate() {
            getEventos();
            vm.goRendiciones = goRendiciones;
        }

        function goRendiciones(evento,publica){
            $state.transitionTo('layout.rendicionesHome', {
                publica: publica,
                evento: evento
            });
        }

        function fillPublicas() {
            vm.eventos.forEach(function (evento, index, array) {
                rendicionService.get(evento.nombre).then(function (rendiciones) {
                    evento.publicas = [];
                    evento.publicas = rendiciones.map(function (obj) { return obj.publica; })
                        .filter((publica, index, self) => self.findIndex((t) => t.nombre === publica.nombre) === index);
                    evento.totalVendidas = 0;
                    evento.generalesVendidas = 0;
                    evento.vipGoldVendidas = 0;
                    evento.damasVendidas = 0;
                    evento.vipsVendidas = 0;
                    evento.entradasEnCalle = 0;

                    evento.publicas.forEach(function (publica) {
                        var rendicionesDelPublica = rendiciones.filter((rendicion) => (rendicion.publica.nombre == publica.nombre));

                        publica.vendidas = calcular(rendicionesDelPublica.filter((rendicion) => (rendicion.isVirtual == 'Ticket' && rendicion.descripcion == 'Rendicion')));

                        publica.vendidasRPC = calcular(rendicionesDelPublica.filter((rendicion) => (rendicion.isVirtual == 'RPC' && rendicion.descripcion == 'RPC')));

                        publica.entregadas = calcular(rendicionesDelPublica.filter((rendicion) => (rendicion.isVirtual == 'Ticket' && rendicion.descripcion == 'Entrega')));

                        publica.devueltas = calcular(rendicionesDelPublica.filter((rendicion) => (rendicion.isVirtual == 'Ticket' && rendicion.descripcion == 'Devolucion')));

                        publica.totalVendidas = publica.vendidas + publica.vendidasRPC;
                        publica.enCalle = publica.entregadas - publica.vendidas - publica.devueltas;

                        evento.generalesVendidas += calcularGenerales(rendicionesDelPublica.filter((rendicion) => (rendicion.descripcion == 'RPC' || rendicion.descripcion == 'Rendicion')));
                        evento.damasVendidas += calcularDamas(rendicionesDelPublica.filter((rendicion) => (rendicion.descripcion == 'RPC' || rendicion.descripcion == 'Rendicion')));
                        evento.vipGoldVendidas += calcularGolds(rendicionesDelPublica.filter((rendicion) => (rendicion.descripcion == 'RPC' || rendicion.descripcion == 'Rendicion')));
                        evento.vipsVendidas += calcularVips(rendicionesDelPublica.filter((rendicion) => (rendicion.descripcion == 'RPC' || rendicion.descripcion == 'Rendicion')));
                        evento.totalVendidas += publica.totalVendidas;
                        evento.entradasEnCalle += publica.enCalle;

                    });
                });

            });
        }

        function getEventos() {
            eventoService.get().then(function (eventos) {
                vm.eventos.length = 0;
                vm.eventos.push.apply(vm.eventos, eventos);
                fillPublicas();
            });
        }

        function calcular(rendiciones) {
            var amount = 0;

            rendiciones.forEach(function (rendicion) {
                amount += (rendicion.dama + rendicion.general + rendicion.vip + rendicion.vip_gold);
            });

            if (amount < 0) {
                amount *= -1;
            }

            return amount;
        }

        function calcularGenerales(rendiciones) {
            var amount = 0;

            rendiciones.forEach(function (rendicion) {
                amount += (rendicion.general);
            });

            if (amount < 0) {
                amount *= -1;
            }

            return amount;
        }
        function calcularDamas(rendiciones) {
            var amount = 0;

            rendiciones.forEach(function (rendicion) {
                amount += (rendicion.dama);
            });

            if (amount < 0) {
                amount *= -1;
            }

            return amount;
        }
        function calcularVips(rendiciones) {
            var amount = 0;

            rendiciones.forEach(function (rendicion) {
                amount += (rendicion.vip);
            });

            if (amount < 0) {
                amount *= -1;
            }

            return amount;
        }
        function calcularGolds(rendiciones) {
            var amount = 0;

            rendiciones.forEach(function (rendicion) {
                amount += (rendicion.vip_gold);
            });

            if (amount < 0) {
                amount *= -1;
            }

            return amount;
        }

    }
})();
