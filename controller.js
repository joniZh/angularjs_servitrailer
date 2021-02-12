app.controller('initCtrl', function ($scope, $uibModal, Data, $filter, $http, MyService, $location) {
 $scope.init = function () {
    $scope.grupos = {};
    $scope.products = [];
    $scope.ordenes = [];
 };
});

app.controller('order_send', function ($scope, Data, MyService, $location, $filter, toaster) {

    // Data.get('select_all_ordenes').then(function (result) {
    //     $scope.ordenes = result.query;
    //     console.log($scope.ordenes);
    // });
    $scope.data_reports_send = {
        fecha_desde : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_hasta : $filter('date')(new Date(), 'yyyy-MM-dd'),
        cliente : '', 
        no_orden: ''
    };

    $scope.filtrar_reports_send = function () {
        $scope.ordenes = '';
        $dt = $scope.data_reports_send;
        if ($dt.fecha_hasta >= $filter('date')(new Date(), 'yyyy-MM-dd') ) {
            $dt.fecha_hasta = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($dt.fecha_desde >= $dt.fecha_hasta ){
                $dt.fecha_desde = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
        }
        if(!$dt.cliente) {
            delete $dt.cliente;
        }
        if(!$dt.no_orden ){
            delete $dt.no_orden;
        }
        console.log($dt);
        Data.post('filter_reports_send', $dt).then( function ( result ) {
            console.log(result);
            // $scope.products = result.query;
            $scope.ordenes = result.query;
        });
    };

});


app.controller('new_order', function ($scope, Data, MyService, $location, $filter, toaster) {

    Data.get('get_products').then(function (result) {
        // console.log(result.query);
        $scope.products = result.query;
    });

    Data.get('get_cars').then(function (result) {
        // console.log(result.query);
        $scope.cars = result.query;

    });

    $scope.dataRuta = function () {
        if ($scope.data_order.ruta) {
            $scope.products.forEach(product => {
                if(product.codigo === $scope.data_order.ruta) {
                    $scope.data_order.origen = product.nombreUnico;
                    $scope.data_order.destino = product.nombreUnico;
                    $scope.data_order.recorrido = product.nombreUnico;
                }
            });
        }
    };

    $scope.dataPlaca = function () {
        if ($scope.data_order.placa) {
            $scope.cars.forEach(item => {
                if(item.placa === $scope.data_order.placa) {
                    $scope.data_order.conductor = item.nombres + " " + item.apellidos;
                }
            });
        }
    };

    $scope.data_order = {
        fecha_registro : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_creacion : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_entrega : $filter('date')(new Date(), 'yyyy-MM-dd'),
        ruta: ''
    };

    $scope.save_order = function () {
        // console.log($scope.data_order);
        $dt = $scope.data_order;
        $data = {
            no_orden_viaje: $dt.no_orden_viaje,
            id_cliente: $dt.cliente_externo,
            id_tramo: $dt.tramo,
            id_agente_operador: $dt.operador,
            id_producto: $dt.ruta,
            id_vehiculo: $dt.placa,
            fecha_registro: $dt.fecha_registro,
            fecha_creacion: $dt.fecha_creacion,
            fecha_entrega: $dt.fecha_entrega,
            no_orden: $dt.no_orden,
            arrastre: $dt.arrastre,
            id_estado: 1
        }
        if ( $dt.tramo != 4 ) { // verificamos que tenga no sea desvio
            $data.kilometraje_normal = $dt.km_normal;
            $data.tarifa_km_normal = $dt.tarifa_normal;
        } else {
            $data.kilometraje_desvio = $dt.km_desvio;
            $data.tarifa_km_desvio = $dt.tarifa_desvio;
            $data.detalle_desvio = $dt.detalle_desvio;
        }
        console.log($data);
        // if (data_order.length != null ) {
            Data.post('save_order_', $data).then(function (result) {
                console.log(result);
                if (result.rta === 'OK') {
                    $location.path('index/');
                }
                Data.toast({"status": result.tipo, "message": result.msg});
            });
        // } else {
        //     Data.toast({"status": "error", "message": "EL FOMRULARIO ESTA INCOMPLETO...!!!!!!!!!!"});
        // }
    };

});


app.controller('orders_exit', function ($scope, Data, MyService, $location, $filter, toaster) {

    // Data.get('select_all_reports').then(function (result) {
    //     $scope.reports = result.query;
    // });

    Data.get('get_type_egreso').then(function (result) {
        $scope.types_egreso = result.query;
    });

    Data.get('get_proveedor_externo').then(function (result) {
        $scope.provider_extern = result.query;
    });

    Data.get('get_cars').then(function (result) {
        $scope.cars = result.query;
    });

    $scope.data_egress = {
        fecha_desde : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_hasta : $filter('date')(new Date(), 'yyyy-MM-dd'),
        cliente : '', 
        no_orden: ''
    };

    $scope.new_comprobant = {
        placa: '',
        ruc: '', 
        detalle: '', 
        valor: '', 
        fecha: $filter('date')(new Date(), 'yyyy-MM-dd'),
        no_factura: '',
        tipo_egreso: '',
        estado: 1

    }


    $scope.save_report = function () {
        // console.log($scope.new_comprobant);
        $dt = $scope.new_comprobant;
        $data = {
            id_proveedor: $dt.ruc,
            id_vehiculo: $dt.placa,
            id_tipo_egreso: $dt.tipo_egreso,
            no_factura: $dt.no_factura,
            id_orden: $dt.no_orden_envio,
            detalle: $dt.detalle,
            valor: $dt.valor,
            fecha: $dt.fecha
            // estado: $dt.estado
        }
        console.log($data);
        // if (data_order.length != null ) {
            Data.post('save_egreso', $data).then(function (result) {
                console.log(result);
                if (result.rta === 'OK') {
                    // $location.path('index/orders_exit');
                    location.reload();
                }
                Data.toast({"status": result.tipo, "message": result.msg});
            });
        // } else {
        //     Data.toast({"status": "error", "message": "EL FOMRULARIO ESTA INCOMPLETO...!!!!!!!!!!"});
        // }
    };

    $scope.filtrar_reports_egress = function() {

        $dt = $scope.data_egress;
        if ($dt.fecha_hasta >= $filter('date')(new Date(), 'yyyy-MM-dd') ) {
            $dt.fecha_hasta = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($dt.fecha_desde >= $dt.fecha_hasta ){
                $dt.fecha_desde = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
        }
        if(!$dt.cliente) {
            delete $dt.cliente;
        }
        if(!$dt.no_orden ){
            delete $dt.no_orden;
        }
        Data.post('filter_reports_egress', $dt).then( function ( result ) {
            console.log(result);
            $scope.reports = result.query;
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    }

});


app.controller('liquidation_client', function ($scope, Data, MyService, $location, $filter, toaster) {

    $scope.data_liquidation_cli = {
        fecha_desde : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_hasta : $filter('date')(new Date(), 'yyyy-MM-dd'),
        cliente: '', 
        no_orden: ''
    };

    $scope.filtrar_liquidation_client = function() {
        $dt = $scope.data_liquidation_cli;
        if ($dt.fecha_hasta >= $filter('date')(new Date(), 'yyyy-MM-dd') ) {
            $dt.fecha_hasta = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($dt.fecha_desde >= $dt.fecha_hasta ){
                $dt.fecha_desde = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
        }
        if(!$dt.no_orden ){
            delete $dt.no_orden;
        }
        Data.post('filter_reports', $dt).then( function ( result ) {
            console.log(result);
            if ( result.rta === "OK" ) {
                result.query.forEach(item => {
                    item.select = 0;
                });
                $scope.liquidations_client = result.query;
            }
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    }
    $scope.select_liquidation = function ( id ) {
        console.log( id );
        $scope.liquidations_client.forEach(item => {
            if(item.id == id ) {
                if( item.select == 1 ) { 
                    item.select = 0;
                } else {
                    item.select = 1;
                }
            }
        });
        console.log($scope.liquidations_client);
    }

    $scope.generic_liquidation = function ( ) {
        $scope.select_liquidations = [];
        $scope.liquidations_client.forEach(item => {
            if( item.select == 1 ) {
                if(item.tramo == "DESVIO") {
                    item.valor = (item.tkd * item.kd).toFixed(2);
                } else {
                    item.valor = (item.tkn * item.kn).toFixed(2);
                }
                $scope.select_liquidations.push(item);
            } 
        });
        console.log($scope.select_liquidations);
    }

    $scope.save_liquidations = function () {
        $data = [];
        console.log($scope.select_liquidations);
        $dta = $scope.select_liquidations;
        $dta.forEach(dt => {
            console.log(dt);
            $var_data = {
                id_orden_envio: dt.id,
                id_producto: dt.codigo,
                id_vehiculo: dt.placa,
                no_orden: dt.no_orden,
                no_orden_viaje: dt.no_orden_viaje,
                valor: dt.valor,
                estado: 1,
                fecha: $filter('date')(new Date(), 'yyyy-MM-dd')
            }
            if (dt.tramo == "DESVIO") {
                $var_data.km = dt.kd; 
                $var_data.tarifa = dt.tkd; 
            } else {
                console.log( dt.kn,  dt.tkn);
                $var_data.km = dt.kn; 
                $var_data.tarifa = dt.tkn; 
            }
            $data.push($var_data);
        });
        $resultSave = [];
        $data.forEach( item => {
            console.log(item);
            Data.post('save_liquidation_cli', item).then(function (result) {
                console.log(result);
                if (result.rta === 'OK') {
                    $odn = {
                        id: item.id_orden_envio,
                        estado: '2'
                    }
                    Data.put('update_order_send', $odn ).then(function (result2) {
                       console.log(result2);
                       if( result2.rta === 'OK' ) {
                        $resultSave.push({orden: item.id_orden_envio, result: result2.rta });
                       }
                    });
                }
                Data.toast({"status": result.tipo, "message": result.msg});
            });
        });
        console.log($resultSave);
        location.reload();
    }
});

app.controller('liquidation_carrier', function ($scope, Data, MyService, $location, $filter, toaster) {
    
    $scope.data_liquidation_carrier = {
        fecha_desde : $filter('date')(new Date(), 'yyyy-MM-dd'),
        fecha_hasta : $filter('date')(new Date(), 'yyyy-MM-dd'),
        placa : ''
    };

    $scope.filtrar_liquidation_client = function() {

        $dt = $scope.data_liquidation_cli;
        if ($dt.fecha_hasta >= $filter('date')(new Date(), 'yyyy-MM-dd') ) {
            $dt.fecha_hasta = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($dt.fecha_desde >= $dt.fecha_hasta ){
                $dt.fecha_desde = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
        }
        if(!$dt.placa) {
            delete $dt.placa;
        }
        Data.post('filter_reports', $dt).then( function ( result ) {
            // console.log(result);
            result.query.forEach(item => {
                item.select = 0;
            });
            $scope.liquidations_carrier = result.query;
            console.log($scope.liquidations_carrier);
            Data.toast({"status":result.tipo,"message":result.msg});
        });
    }
});



app.controller('ctrlOrdenes', function ($scope, $http) {
    $http.get('index/get_secuencia_ordenes').then(function (result) {
        $scope.nro_orden = result.data.valor;
    });

    $scope.reset_ordenes = function () {
        $http.get('index/reset_secuencia_ordenes').then(function (result) {
            if(result.data.valor > 0){
                $scope.nro_orden = 0;
                Data.toast({"status": '', "message": 'HA SIDO RESEATADA...!!!'});
            }else{
                Data.toast({"status": '', "message": 'NO HA SIDO RESEATADA...!!!'});
            }
        });
    };
});