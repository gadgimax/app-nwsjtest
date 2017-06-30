(function () {
    'use strict';

    angular
        .module('rendicion')
        .controller('Rendicion', Rendicion);

    function Rendicion(rendicionService, $uibModal, eventoService, publicaService, $state, $stateParams) {
        var vm = this;
        vm.dateOptions = {
            format: 'dd-MM-yyyy'
        }

        vm.backupPublica = angular.copy($stateParams.publica);
        vm.selectedPublica = angular.copy($stateParams.publica);
        // Variables que vamos a usar para almacenar cosas temporales
        vm.rendicion = {};
        vm.theOpened = $stateParams.evento;
        vm.AllRendiciones = [];
        vm.selectedPrecio = {};
        vm.verDetalle = false;
        vm.deleteRendicion = deleteRendicion;
        vm.anular = anular;

        //Arrays donde guardamos todos los eventos y todos los publicas, para despues filtrar
        vm.eventos = [];
        vm.publicas = [];
        vm.filterEvents = filterEvents;
        vm.getPublicas = getPublicas;
        vm.getEventos = getEventos;
        vm.getEventosByPublica = getEventosByPublica;
        vm.eventoOpened = eventoOpened;
        vm.entregarEntradas = entregarEntradas;
        vm.llenarConTotales = llenarConTotales;
        vm.rendirEntradas = rendirEntradas;
        vm.devolverEntradas = devolverEntradas;
        vm.actualizarMontoParcial = actualizarMontoParcial;

        vm.open = openModal;

        activate();

        function activate() {
            getPublicas();
            getEventos();

        }

        function anular(tipo, rendi) {
            if (tipo === 'd') {
                rendicionService.anular(tipo, rendi, vm.anularD).then(function () {
                    vm.eventoOpened(vm.theOpened);
                });
            }
            else if (tipo === 'g') {
                rendicionService.anular(tipo, rendi, vm.anularG).then(function () {
                    vm.eventoOpened(vm.theOpened);
                });
            }
            else if (tipo === 'v') {
                rendicionService.anular(tipo, rendi, vm.anularV).then(function () {
                    vm.eventoOpened(vm.theOpened);
                });
            }
            else {
                rendicionService.anular(tipo, rendi, vm.anularVG).then(function () {
                    vm.eventoOpened(vm.theOpened);
                });
            }
        }

        function getEventos() {
            eventoService.get().then(function (data) {
                vm.eventos.length = 0;
                vm.eventos.push.apply(vm.eventos, data);
                if(vm.theOpened){
                vm.eventoOpened(vm.eventos.find(function(x){
                    return x.nombre === vm.theOpened.nombre
                }));
                }
            });
        }

        function filterEvents() {
            eventoService.get(vm.fechaDesde).then(function (data) {
                vm.eventos.length = 0;
                vm.eventos.push.apply(vm.eventos, data);
            });

            getEventosByPublica(vm.selectedPublica);
        }

        function getPublicas() {
            publicaService.get().then(function (data) {
                vm.publicas.length = 0;
                vm.publicas.push.apply(vm.publicas, data);
                if(vm.backupPublica){
                    vm.selectedPublica = vm.publicas.find(function(x){
                    return x.nombre === vm.backupPublica.nombre
                    });
                }
            });
        }

        function getEventosByPublica($item, $model, $label, $event) {
            eventoService.getByPublica($item._id).then(function (data) {
                vm.eventos.forEach(function (element, index, array) {
                    element.isAssignedToPublica = false;
                    if (data.find(x => x._id === element._id)) {
                        element.isAssignedToPublica = true;
                    }
                });
            });
        }



        function eventoOpened(evento) {
            vm.rendicion = {};
            vm.theOpened = evento;
            evento.isOpen=true;
            vm.rendicion.isVirtual = 'Ticket';

            evento.montoParcial = 0;

            rendicionService.getByPublicaAndEvento(vm.selectedPublica.nombre, evento.nombre)
                .then(function (data) {
                    evento.rendiciones = data;
                    vm.selectedPrecio = evento.precios[evento.precios.length - 1];
                    evento.resultadoRendiciones = calcularCantidadDeEntradas(data);
                    eventoService.getByNombre(evento.nombre).then(function (data) {
                        evento.resultadoRendiciones.montoTotal = calcularMontoTotal(evento.resultadoRendiciones);
                    });
                });

            rendicionService.getAllByPublicaAndEvento(vm.selectedPublica.nombre, evento.nombre)
                .then(function (data) {
                    vm.AllRendiciones.length=0;
                    vm.AllRendiciones.push.apply(vm.AllRendiciones,data);
                });
        }

        function calcularCantidadDeEntradas(rendiciones) {
            var entradasDama = 0;
            var entradasGenerales = 0;
            var entradasVip = 0;
            var entradasVipGold = 0;

            rendiciones.forEach(function (element, index, array) {
                entradasDama += element.dama;
                entradasGenerales += element.general;
                entradasVip += element.vip;
                entradasVipGold += element.vip_gold;
            });

            return {
                dama: entradasDama,
                general: entradasGenerales,
                vip: entradasVip,
                vip_gold: entradasVipGold
            }
        }

        function calcularMontoTotal(rendicion) {
            var montoTotal = 0;
            if (rendicion.isVirtual === 'RPC') {
                if (rendicion.dama) {
                    montoTotal += (vm.selectedPrecio.precio_dama_rpc * rendicion.dama);
                }
                if (rendicion.general) {
                    montoTotal += (vm.selectedPrecio.precio_general_rpc * rendicion.general);
                }
                if (rendicion.vip) {
                    montoTotal += (vm.selectedPrecio.precio_vip_rpc * rendicion.vip);
                }
                if (vm.selectedPrecio.precio_vip_gold_rpc && rendicion.vip_gold) {
                    montoTotal += (vm.selectedPrecio.precio_vip_gold_rpc * rendicion.vip_gold);
                }
                vm.rendicion.montoTotal = rendicion.montoTotal = montoTotal;
                return montoTotal;
            } else {
                if (rendicion.dama) {
                    montoTotal += (vm.selectedPrecio.precio_dama * rendicion.dama);
                }
                if (rendicion.general) {
                    montoTotal += (vm.selectedPrecio.precio_general * rendicion.general);
                }
                if (rendicion.vip) {
                    montoTotal += (vm.selectedPrecio.precio_vip * rendicion.vip);
                }
                if (vm.selectedPrecio.precio_vip_gold && rendicion.vip_gold) {
                    montoTotal += (vm.selectedPrecio.precio_vip_gold * rendicion.vip_gold);
                }
                vm.rendicion.montoTotal = rendicion.montoTotal = montoTotal;
                return montoTotal;
            }
        }

        function giveMeText(instr, evento) {
            var theText = "";
            var detalle = "";
            var total = "";
            if (vm.rendicion.dama) detalle += vm.rendicion.dama + " Damas \n";
            if (vm.rendicion.general) detalle += vm.rendicion.general + " Generales \n";
            if (vm.rendicion.vip) detalle += vm.rendicion.vip + " VIPs \n";
            if (vm.rendicion.vip_gold) detalle += vm.rendicion.vip_gold + " VIPs Gold \n";
            if (instr === "entregar") {
                theText = "Se van a entregar entradas a un publica:\n";
            } else if (instr === "RPC") {
                theText = "El publica esta rindiendo tickets RPCard:\n";
                total = "Por un total de: $" + evento.montoParcial
            } else if (instr === "Rendicion") {
                theText = "El publica esta rindiendo entradas anticipadas:\n";
                total = "Por un total de: $" + evento.montoParcial
            } else if (instr === "Devolucion") {
                theText = "El publica esta devolviendo entradas sin vender:\n";
                total = "Se reciben las entradas";
            }
            return theText + detalle + total;


        }

        function entregarEntradas(evento) {
            if (vm.rendicion.dama || vm.rendicion.general || vm.rendicion.vip || vm.rendicion.vip_gold) {
                vm.open().then(function (rendicion) {
                    vm.rendicion = rendicion;
                    //if (confirm(giveMeText('entregar', evento))) {
                    vm.rendicion.descripcion = "Entrega";
                    popularRendicion(false);
                    guardarRendicion(evento);
                    //}
                });
            }
        }

        function rendirEntradas(evento) {
            if (vm.rendicion.dama || vm.rendicion.general || vm.rendicion.vip || vm.rendicion.vip_gold) {
                if (vm.rendicion.isVirtual === 'RPC') {
                    vm.rendicion.descripcion = "RPC";
                } else {
                    vm.rendicion.descripcion = "Rendicion";
                }
                if (confirm(giveMeText(vm.rendicion.descripcion, evento))) {
                    popularRendicion(true);
                    guardarRendicion(evento);
                }
            }
        }

        function devolverEntradas(evento) {
            if (vm.rendicion.dama || vm.rendicion.general || vm.rendicion.vip || vm.rendicion.vip_gold) {
                if (confirm(giveMeText("Devolucion", evento))) {
                    vm.rendicion.descripcion = "Devolucion";
                    popularRendicion(true);
                    guardarRendicion(evento);
                }

            }
        }

        function deleteRendicion(rendi, evento) {
            if (confirm("Desea borrar esta rendicion?")) {
                rendicionService.delete(rendi).then(function (data) {
                    vm.eventoOpened(evento);
                });
            }
        }

        function actualizarMontoParcial(evento) {
            evento.montoParcial = calcularMontoTotal(vm.rendicion);
        }

        function popularRendicion(negada) {
            if (!vm.rendicion.dama) {
                vm.rendicion.dama = 0;
            }
            if (!vm.rendicion.general) {
                vm.rendicion.general = 0;
            }
            if (!vm.rendicion.vip) {
                vm.rendicion.vip = 0;
            }
            if (!vm.rendicion.vip_gold) {
                vm.rendicion.vip_gold = 0;
            }

            if (negada) {
                vm.rendicion.dama *= -1;
                vm.rendicion.general *= -1;
                vm.rendicion.vip *= -1;
                vm.rendicion.vip_gold *= -1;
            }
            vm.rendicion.tanda = {
                nombre:vm.selectedPrecio.nombre,
                pdama:vm.selectedPrecio.precio_dama,
                pgeneral:vm.selectedPrecio.precio_general,
                pvip: vm.selectedPrecio.precio_vip,
                pvipgold: vm.selectedPrecio.precio_vip_gold,
                prdama: vm.selectedPrecio.precio_dama_rpc,
                prgeneral: vm.selectedPrecio.precio_general_rpc,
                prvip: vm.selectedPrecio.precio_vip_rpc,
                prvipgold: vm.selectedPrecio.precio_vip_gold_rpc
            };
        }

        function guardarRendicion(evento) {
            vm.rendicion.fecha = new Date();
            vm.rendicion.publica = {
                nombre: vm.selectedPublica.nombre,
                id: vm.selectedPublica._id
            };
            vm.rendicion.evento = {
                nombre: evento.nombre,
                id: evento._id
            };
            rendicionService.save(vm.rendicion);
            var aux = vm.rendicion.isVirtual;
            vm.rendicion = {};
            vm.rendicion.isVirtual = aux;
            vm.getEventosByPublica(vm.selectedPublica);
            evento.montoParcial = 0;
            vm.eventoOpened(evento);
        }

        function llenarConTotales(evento) {
            var aux = vm.rendicion.isVirtual
            vm.rendicion = {};
            vm.rendicion.isVirtual = aux;
            vm.rendicion.dama = evento.resultadoRendiciones.dama;
            vm.rendicion.general = evento.resultadoRendiciones.general;
            vm.rendicion.vip = evento.resultadoRendiciones.vip;
            vm.rendicion.vip_gold = evento.resultadoRendiciones.vip_gold;
            actualizarMontoParcial(evento);
        }

        function openModal() {
            return $uibModal.open({
                animation: true,
                templateUrl: './app/rendicion/myModalRendicion.html',
                controller: 'ModalRendicionCtrl',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    rendicion: function () {
                        return vm.rendicion;
                    }
                }
            }).result;
        };
    }
})();