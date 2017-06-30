(function () {
    'use strict';

    angular
        .module('services')
        .factory('rendicionService', rendicionService);

    function rendicionService($q) {
        var Datastore = require('nedb');

        var dbRendicion = new Datastore({
            filename: "./" + "Rendiciones" + ".db",
            autoload: true
        });

        var service = {};
        service.save = save;
        service.get = getByEvento;
        service.getByDate = getByDate;
        service.getByPublicaAndEvento = getByPublicaAndEvento;
        service.getAllByPublicaAndEvento = getAllByPublicaAndEvento;
        service.getByNum = getByNum;
        service.delete = deleteRendicion;
        service.anular = anularTicket;
        service.getGastos = getGastos;

        return service;

        function getByEvento(nombreEvento) {
            return $q(function (resolve) {
                dbRendicion.find({
                    "evento.nombre": nombreEvento
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getGastos(nombreEvento) {
            return $q(function (resolve) {
                dbRendicion.find({
                    "descripcion": 'Gastos'
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getByDate(start) {

            if (start == undefined) {
                start = new Date();
            }
            start.setSeconds(0);
            start.setHours(0);
            start.setMinutes(0);

            var dateMidnight = new Date(start);
            dateMidnight.setHours(23);
            dateMidnight.setMinutes(59);
            dateMidnight.setSeconds(59);
            return $q(function (resolve) {
                dbRendicion.find({ fecha: { $gte: start, $lt: dateMidnight }, descripcion: { $nin: ['Entrega', 'Devolucion'] } }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function deleteRendicion(rendi) {
            return $q(function (resolve) {
                dbRendicion.remove({
                    _id: rendi._id
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getByPublica(nombrePublica) {
            return $q(function (resolve) {
                dbRendicion.find({
                    "publica.nombre": nombrePublica
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getByNum(nroTicket) {
            return $q(function (resolve) {
                dbRendicion.find({
                    $or: [{
                        numDama: {
                            $elemMatch: nroTicket
                        }
                    }, {
                        numGeneral: {
                            $elemMatch: nroTicket
                        }
                    }, {
                        numVip: {
                            $elemMatch: nroTicket
                        }
                    }, {
                        numVipGold: {
                            $elemMatch: nroTicket
                        }
                    }]
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getByPublicaAndEvento(nombrePublica, nombreEvento) {
            return $q(function (resolve) {
                dbRendicion.find({
                    "publica.nombre": nombrePublica,
                    "evento.nombre": nombreEvento,
                    descripcion: {
                        $ne: 'RPC'
                    }
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function getAllByPublicaAndEvento(nombrePublica, nombreEvento) {
            return $q(function (resolve) {
                dbRendicion.find({
                    "publica.nombre": nombrePublica,
                    "evento.nombre": nombreEvento
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function anularTicket(t, obj, value) {
            return $q(function (resolve) {
                try {
                    if (t === 'd') {
                        dbRendicion.update({ _id: obj._id }, { $pull: { numDama: value } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbRendicion.update({ _id: obj._id }, { $set: { dama: obj.dama - 1 } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbEvento.update({ _id: obj.evento.id }, { $push: { anuladas: value } }, {}, function (err, docs) {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                            resolve(docs);
                        });
                    }
                    else if (t === 'g') {
                        dbRendicion.update({ _id: obj._id }, { $pull: { numGeneral: value } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbRendicion.update({ _id: obj._id }, { $set: { general: obj.general - 1 } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbEvento.update({ _id: obj.evento.id }, { $push: { anuladas: value } }, {}, function (err, docs) {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                            resolve(docs);
                        });
                    }
                    else if (t === 'v') {
                        dbRendicion.update({ _id: obj._id }, { $pull: { numVip: value } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbRendicion.update({ _id: obj._id }, { $set: { vip: obj.vip - 1 } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbEvento.update({ _id: obj.evento.id }, { $push: { anuladas: value } }, {}, function (err, docs) {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                            resolve(docs);
                        });
                    }
                    else {
                        if (t === 'g') { }
                        dbRendicion.update({ _id: obj._id }, { $pull: { numVipGold: value } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbRendicion.update({ _id: obj._id }, { $set: { vip_gold: obj.vip_gold - 1 } }, {}, function () {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                        });
                        dbEvento.update({ _id: obj.evento.id }, { $push: { anuladas: value } }, {}, function (err, docs) {
                            if (err) {
                                alert("Update Failed");
                                return;
                            }
                            resolve(docs);
                        });
                    }
                }
                catch (err) {
                    alert(err.message);
                }
            });
        }

        function save(obj) {
            try {
                dbRendicion.insert(obj, function (err) {
                    if (err) {
                        alert("Insert Failed");
                        return;
                    }
                });
            } catch (err) {
                alert(err.message);
            }
        }

    }
}());