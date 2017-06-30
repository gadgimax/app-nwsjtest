(function () {
    'use strict';

    angular
        .module('services')
        .factory('exportExcelService', exportExcelService);

    function exportExcelService($q, rendicionService) {
        var fs = require('fs');

        const XLSX = require('xlsx-style');

        function datenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }

        function sheet_from_array_of_arrays(data) {
            var ws = {};
            var range = {
                s: {
                    c: 10000000,
                    r: 10000000
                },
                e: {
                    c: 0,
                    r: 0
                }
            };
            for (var R = 0; R !== data.length; ++R) {
                for (var C = 0; C !== data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;

                    if (data[R][C] && typeof data[R][C] === 'object' && data[R][C].style && !(data[R][C] instanceof Date)) {
                        var cell = {
                            v: data[R][C].value,
                            s: data[R][C].style
                        };
                    } else {
                        var cell = {
                            v: data[R][C]
                        };
                    }

                    if (cell.v === null) continue;
                    var cell_ref = XLSX.utils.encode_cell({
                        c: C,
                        r: R
                    });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    } else cell.t = 's';
                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        var builder = {
            parse: function (mixed, options) {
                var ws;
                if (typeof mixed === 'string') ws = XLSX.readFile(mixed, options);
                else ws = XLSX.read(mixed, options);
                return _.map(ws.Sheets, function (sheet, name) {
                    return {
                        name: name,
                        data: XLSX.utils.sheet_to_json(sheet, {
                            header: 1,
                            raw: true
                        })
                    };
                });
            },
            build: function (array) {
                var defaults = {
                    bookType: 'xlsx',
                    bookSST: false,
                    type: 'binary'
                };
                var wb = new Workbook();
                array.forEach(function (worksheet) {
                    var name = worksheet.name || 'Sheet';
                    var data = sheet_from_array_of_arrays(worksheet.data || []);
                    wb.SheetNames.push(name);
                    wb.Sheets[name] = data;

                    if (worksheet.config.cols) {
                        wb.Sheets[name]['!cols'] = worksheet.config.cols
                    }

                });

                var data = XLSX.write(wb, defaults);
                if (!data) return false;
                var buffer = new Buffer(data, 'binary');
                return buffer;

            }
        };

        var excel = {
            buildExport: function (params) {
                if (!(params instanceof Array)) throw 'buildExport expects an array';

                let sheets = [];
                params.forEach(function (sheet, index) {
                    let specification = sheet.specification;
                    let dataset = sheet.data;
                    let sheet_name = sheet.name || 'Sheet' + index + 1;
                    let data = [];
                    let config = {
                        cols: []
                    };

                    if (!specification || !dataset) throw 'missing specification or dataset.';

                    if (sheet.heading) {
                        sheet.heading.forEach(function (row) {
                            data.push(row);
                        });
                    }

                    //build the header row
                    let header = [];
                    for (let col in specification) {
                        header.push({
                            value: specification[col].displayName,
                            style: (specification[col].headerStyle) ? specification[col].headerStyle : undefined
                        });

                        if (specification[col].width) {
                            if (Number.isInteger(specification[col].width)) config.cols.push({
                                wpx: specification[col].width
                            });
                            else if (Number.isInteger(parseInt(specification[col].width))) config.cols.push({
                                wch: specification[col].width
                            });
                            else throw 'Provide column width as a number';
                        } else {
                            config.cols.push({});
                        }

                    }
                    data.push(header); //Inject the header at 0

                    dataset.forEach(record => {
                        let row = [];
                        for (let col in specification) {
                            let cell_value = record[col];

                            if (specification[col].cellFormat && typeof specification[col].cellFormat == 'function') {
                                cell_value = specification[col].cellFormat(record[col], record);
                            }

                            if (specification[col].cellStyle && typeof specification[col].cellStyle == 'function') {
                                cell_value = {
                                    value: cell_value,
                                    style: specification[col].cellStyle(record[col], record)
                                };
                            } else if (specification[col].cellStyle) {
                                cell_value = {
                                    value: cell_value,
                                    style: specification[col].cellStyle
                                };
                            }
                            row.push(cell_value); // Push new cell to the row
                        }
                        data.push(row); // Push new row to the sheet
                    });

                    sheets.push({
                        name: sheet_name,
                        data: data,
                        config: config
                    });

                });

                return builder.build(sheets);

            }
        }

        var AdmZip = require('adm-zip');
        var service = {
            pepe: pepe,
            pepe2: pepe2,
            backup: backup,
            restore: restore
        }

        return service;

        function backup(path) {
            var zip = new AdmZip();
            zip.addLocalFile("./Eventos.db");
            zip.addLocalFile("./Publicas.db");
            zip.addLocalFile("./Rendiciones.db");
            zip.writeZip(path);
        }

        function restore(path) {
            var zip = new AdmZip(path);
            zip.extractAllTo("./", /*overwrite*/ true);
        }

        function pepe2(filepath, eventos, datepick) {
            var styles = {
                headerDark: {
                    fill: {
                        fgColor: {
                            rgb: 'FF000000'
                        }
                    },
                    font: {
                        color: {
                            rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true,
                        underline: true
                    },
                    alignment: {
                        horizontal: "center"
                    }
                }, headerGreen: {
                    fill: {
                        fgColor: {
                            rgb: '6EC977'
                        }
                    },
                    font: {
                        color: {
                            rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true,
                        underline: true
                    }, alignment: {
                        horizontal: "center"
                    }
                },
                centeredAlign: {
                    alignment: {
                        horizontal: "center"
                    }
                }
            };
            var specification = {
                Fecha: {
                    displayName: 'Fecha',
                    headerStyle: styles.headerDark,
                    width: 120,
                    cellStyle: styles.centeredAlign
                },
                Publica: {
                    displayName: 'Publica',
                    headerStyle: styles.headerDark,
                    width: 150,
                    cellStyle: styles.centeredAlign
                },
                Dama: {
                    displayName: 'Dama',
                    headerStyle: styles.headerGreen,
                    width: 80,
                    cellStyle: styles.centeredAlign
                },
                General: {
                    displayName: 'General',
                    headerStyle: styles.headerGreen,
                    width: 80,
                    cellStyle: styles.centeredAlign
                }
                ,
                VIP: {
                    displayName: 'VIP',
                    headerStyle: styles.headerGreen,
                    width: 80,
                    cellStyle: styles.centeredAlign
                },
                Gold: {
                    displayName: 'VIP Gold',
                    headerStyle: styles.headerGreen,
                    width: 80,
                    cellStyle: styles.centeredAlign
                },
                Monto: {
                    displayName: 'Importe',
                    headerStyle: styles.headerDark,
                    width: 120,
                    cellStyle: styles.centeredAlign
                },
                Evento: {
                    displayName: 'Evento',
                    headerStyle: styles.headerDark,
                    width: 120,
                    cellStyle: styles.centeredAlign
                }
            };

            rendicionService.getByDate(datepick).then(function (rends) {
                var maxMonto = parseInt('0');
                if (datepick == undefined) {
                    datepick = new Date();
                }
                datepick.setSeconds(0);
                datepick.setHours(0);
                datepick.setMinutes(0);
                var dd = datepick.getDate();
                var mm = datepick.getMonth() + 1;//January is 0! 
                var yyyy = datepick.getFullYear();
                if (dd < 10) { dd = '0' + dd }
                if (mm < 10) { mm = '0' + mm }
                var fechaStr = dd + '/' + mm + '/' + yyyy;

                var array = new Array;

                var newSheet = {};
                var dataset = new Array;
                newSheet.name = 'Movimientos Diarios';
                newSheet.specification = specification;

                var rends = rends.sort(function (a, b) {
                    return a.evento.nombre > b.evento.nombre;
                });

                rends.forEach(function (rend) {

                    var totales2 = {
                        Fecha: fechaStr,
                        Publica: (rend.descripcion != 'Gastos') ? (rend.publica.nombre + ' - ' + rend.descripcion) : rend.detalle,
                        Dama: rend.dama * -1,
                        General: rend.general * -1,
                        VIP: rend.vip * -1,
                        Gold: rend.vip_gold * -1,
                        Monto: (rend.descripcion != 'Gastos') ? (rend.montoTotal) : rend.montoTotal * -1,
                        Evento: rend.evento.nombre
                    }
                    maxMonto += parseInt(totales2.Monto);
                    dataset.push(totales2);
                });
                var totalesFinal = {
                    Fecha: '',
                    Publica: '',
                    Dama: '',
                    General: '',
                    VIP: '',
                    Gold: 'Total:',
                    Monto: maxMonto,
                    Evento: ''
                };
                dataset.push(totalesFinal);
                newSheet.data = dataset;
                array.push(newSheet);
                var report = excel.buildExport(array);

                fs.writeFile(filepath, report, function (err) {
                    if (err) return console.log(err);
                });
            });
        }
        function pepe(filePath, eventos) {
            // You can define styles as json object 
            // More info: https://github.com/protobi/js-xlsx#cell-styles 
            var styles = {
                headerDark: {
                    fill: {
                        fgColor: {
                            rgb: 'FF000000'
                        }
                    },
                    font: {
                        color: {
                            rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true,
                        underline: true
                    }
                },
                cellPink: {
                    fill: {
                        fgColor: {
                            rgb: 'FFFFCCFF'
                        }
                    }
                },
                cellGreen: {
                    fill: {
                        fgColor: {
                            rgb: 'FF00FF00'
                        }
                    }
                }
            };

            // Array of objects representing heading rows (very top) 
            // let heading = [
            //     [{
            //         value: 'a1',
            //         style: styles.headerDark
            //     }, {
            //         value: 'b1',
            //         style: styles.headerDark
            //     }, {
            //         value: 'c1',
            //         style: styles.headerDark
            //     }],
            //     ['a2', 'b2', 'c2'] // <-- It can be only values 
            // ];

            //Here you specify the export structure 
            var specification = {
                nombre: {
                    displayName: 'Descripcion',
                    headerStyle: styles.headerDark,
                    width: 150
                },
                cantidad: {
                    displayName: 'Cantidad',
                    headerStyle: styles.headerDark,
                    width: 120
                },
                texto: {
                    displayName: 'Precio Ticket',
                    headerStyle: styles.headerDark,
                    width: 120
                }
            }

            getRendiciones(eventos).then(function (eventos) {
                var array = new Array;

                eventos.forEach(function (evento) {
                    var newSheet = {};
                    var dataset = new Array;

                    newSheet.name = evento.nombre;
                    newSheet.specification = specification;

                    var totalTotal = 0;
                    var totalTotalRecaudado = 0;

                    var emptyRow = {
                        nombre: '',
                        cantidad: ''
                    }
                    //envolver en un metodo que lo haga por tandas
                    var tandas = evento.rendiciones.map(function (x) { return x.tanda ? x.tanda : { nombre: 'sin tanda', demo: 0 } });

                    function uniqueBy(arr, fn) {
                        var unique = {};
                        var distinct = [];
                        arr.forEach(function (x) {
                            var key = fn(x);
                            if (!unique[key]) {
                                distinct.push(x);
                                unique[key] = true;
                            }
                        });
                        return distinct;
                    }

                    tandas = uniqueBy(tandas, function (x) { return x.nombre; });
                    var tandaRows = [];

                    for (var n = 0; n < tandas.length; n++) {
                        var tandaRow = {
                            nombre: 'Numero de tanda: ' + n + 1 + ' - ' + tandas[n].nombre,
                            cantidad: ''
                        }
                        tandaRows.push(tandaRow);
                        dataset.push(tandaRow);
                        dataset.push(emptyRow);
                        var selectedTanda = tandas[n];
                        for (var i = 0; i <= 1; i++) {

                            var total = 0;
                            var dama = 0;
                            var general = 0;
                            var vip = 0;
                            var vipGold = 0;
                            var recaudado = 0;
                            var tipo;
                            var descripcion;
                            var headerRow;

                            if (i == 0) {
                                tipo = 'Ticket';
                                descripcion = 'Rendicion';
                                headerRow = {
                                    nombre: 'RRPP - RPC',
                                    cantidad: ''
                                }

                            } else {
                                tipo = 'RPC';
                                descripcion = 'RPC';
                                headerRow = {
                                    nombre: 'RRPP - RPCard',
                                    cantidad: ''
                                }
                            }
                            evento.rendiciones.forEach(function (x) { if (!x.tanda) { x.tanda = { nombre: 'sin tanda' } } })
                            evento.rendiciones.filter((rendicion) => (rendicion.isVirtual == tipo && rendicion.descripcion == descripcion && rendicion.tanda.nombre === selectedTanda.nombre)).forEach(function (item) {
                                dama += item.dama * -1;
                                general += item.general * -1;
                                vip += item.vip * -1;
                                vipGold += item.vip_gold * -1;
                                if (!item.montoTotal) {
                                    item.montoTotal = 0;
                                }
                                recaudado += item.montoTotal;
                            });

                            total += dama + general + vip + vipGold;
                            totalTotal += total;
                            totalTotalRecaudado += recaudado;

                            var footerRow = {
                                nombre: 'TOTAL >',
                                cantidad: total
                            }
                            var rowVipGold = {
                                nombre: 'SECTOR VIP GOLD',
                                cantidad: 'X ' + vipGold + ' Tickets',
                                texto: (selectedTanda.nombre !== 'sin tanda' ? '$' + (tipo === 'RPC' ? selectedTanda.prvipgold : selectedTanda.pvipgold) : '')
                            }
                            var rowVip = {
                                nombre: 'SECTOR VIP',
                                cantidad: 'X ' + vip + ' Tickets',
                                texto: (selectedTanda.nombre !== 'sin tanda' ? '$' + (tipo === 'RPC' ? selectedTanda.prvip : selectedTanda.pvip) : '')
                            }
                            var rowGeneral = {
                                nombre: 'SECTOR GENERAL',
                                cantidad: 'X ' + general + ' Tickets',
                                texto: (selectedTanda.nombre !== 'sin tanda' ? '$' + (tipo === 'RPC' ? selectedTanda.prgeneral : selectedTanda.pgeneral) : '')

                            }
                            var rowDama = {
                                nombre: 'SECTOR DAMA',
                                cantidad: 'X ' + dama + ' Tickets',
                                texto: (selectedTanda.nombre !== 'sin tanda' ? '$' + (tipo === 'RPC' ? selectedTanda.prdama : selectedTanda.pdama) : '')
                            }
                            var rowRecaudado = {
                                nombre: 'RECAUDADO',
                                cantidad: recaudado
                            }

                            dataset.push(headerRow);
                            dataset.push(rowDama);
                            dataset.push(rowGeneral);
                            dataset.push(rowVip);
                            dataset.push(rowVipGold);
                            dataset.push(footerRow);
                            dataset.push(rowRecaudado);
                            dataset.push(emptyRow);

                        }
                    }



                    var totales1 = {
                        nombre: 'TOTAL VENDIDAS EVENTO',
                        cantidad: totalTotal
                    }

                    var totales2 = {
                        nombre: 'TOTAL RECAUDADO EVENTO',
                        cantidad: totalTotalRecaudado
                    }
                    dataset.push(emptyRow);
                    dataset.push(totales1);
                    dataset.push(totales2);

                    newSheet.data = dataset;
                    array.push(newSheet);
                });

                var report = excel.buildExport(array);

                fs.writeFile(filePath, report, function (err) {
                    if (err) return console.log(err);
                });
            });

        }

        function getRendiciones(data) {
            return $q(function (resolve) {
                var count = 0;
                data.forEach(function (evento) {
                    rendicionService.get(evento.nombre).then(function (rendiciones) {
                        evento.rendiciones = rendiciones;
                        count++;
                        if (count == data.length) {
                            resolve(data);
                        }
                    });
                });
            });
        }


    }
}());