(function () {
    'use strict';

    angular
        .module('services')
        .factory('publicaService', publicaService);

    function publicaService($q) {
        var Datastore = require('nedb');
        var dbPublica = new Datastore({
            filename: "./" + "Publicas" + ".db",
            autoload: true
        });

        var service = {};
        service.delete = deletePublica;
        service.save = save;
        service.get = get;
        service.update = update;

        return service;

        function get() {
            return $q(function (resolve) {
                dbPublica.find({}, function (err, docs) {
                    resolve(docs);
                });
            });
        }

        function deletePublica(obj) {
            return $q(function (resolve) {
                dbPublica.remove({
                    _id: obj._id
                }, function (err, docs) {
                    resolve(docs);
                });
            });
        }
        
        function save(obj) {
            try {
                dbPublica.insert(obj, function (err) {
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
                dbPublica.update({
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