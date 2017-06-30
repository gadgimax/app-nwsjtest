(function () {
    'use strict';

    angular
        .module('services')
        .factory('eventoService', eventoService);

    function eventoService($q) {

        var Datastore = require('nedb');
        var dbEvento = new Datastore({
            filename: "./" + "Eventos" + ".db",
            autoload: true
        });

        //Fix this when we have time
        var dbRendicion = new Datastore({
            filename: "./" + "Rendiciones" + ".db",
            autoload: true
        });

        var service = {};
        service.save = save;
        service.get = get;
        service.getByPublica = getByPublica;
        service.getByNombre = getByNombre;
        service.update = update;

        return service;

        function get(fromDate) {
            return $q(function (resolve) {
                if (!fromDate) {
                    fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 30);
                }
                dbEvento.find({
                    fecha: {
                        $gte: fromDate
                    }
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
                    var orEventos = [];
                    docs.forEach(function (element, index, array) {
                        orEventos.push({
                            nombre: element.evento.nombre
                        });
                    });
                    dbEvento.find({
                        $or: orEventos
                    }, function (err, docs) {
                        resolve(docs);
                    });
                });
            });
        }

        function getByNombre(nombre) {
            return $q(function (resolve) {
                dbEvento.find({
                    nombre: nombre
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function save(obj) {
            try {
                obj._id = obj.nombre;
                dbEvento.insert(obj, function (err) {
                    if (err) {
                        alert("Insert Failed");
                        return;
                    }
                });
            } catch (err) {
                alert(err.message);
            }
        }

        function update(obj) {
            try {
                dbEvento.update({
                    _id: obj._id
                }, obj, {}, function (err) {
                    if (err) {
                        alert("Update Failed");
                        return;
                    }
                });
            } catch (err) {
                alert(err.message);
            }
        }

    }
}());