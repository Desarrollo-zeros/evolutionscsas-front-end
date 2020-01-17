function getPersons(id = 0, initial = 0) {
    var link =  (id ===0) ? 0 : id;
    var user = JSON.parse(localStorage.user);
    $.ajax({
        url : url+"api/person/"+ link+"/10",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type : 'get',
        headers: {'Authorization': 'Bearer '+user.token},
        success :function (data) {

            for(var i in data){
                data[i].user = state(data[i].user.state);
            }


            if (!$.fn.dataTable.isDataTable('#UserTable')) {
                $('#UserTable').DataTable( {
                    data: data,
                    columns: [
                        { data: 'id' },
                        { data: 'firstName' },
                        { data: 'firstLastName' },
                        { data: 'secondName' },
                        { data: 'secondLastName' },
                        { data: 'user' },
                    ]
                } );
            }


        },
        error: function(jqXHR, textStatus, errorThrown) {
            $.notify("error, peticion no soportada");
        }
    });
}

function state(state) {
    if(state === 1){
        return "<td style='color : #1c7430'>Activo</td>";
    }
    return "<td style='color : #fe0000'>Inactivo</td>";
}




/*Dojo*/
var tam = 0,
    position = 1,
    mapView,
    deptDialog,
    global = {},
    depColLayer,
    map,
    VerColLayer,
    verColLayer1,
    graphicsLayer,
    homeBtn,
    table = [],
    extent,
    stateMap = false,
    UserDialog;

require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "dijit/form/Button",
        "dijit/Dialog",
        "esri/views/draw/Draw",
        "esri/Graphic",
        "esri/geometry/geometryEngine",
        "esri/PopupTemplate",
        "esri/widgets/Sketch/SketchViewModel",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Sketch",
        "esri/widgets/Home",
    ],
    function (
        Map,
        MapView,
        FeatureLayer,
        Button,
        Dialog,
        Draw, Graphic, geometryEngine, PopupTemplate, SketchViewModel, GraphicsLayer,Sketch,Home
    ) {



        UserDialog = new Dialog({
            title: "Usuarios",
            style: "width: 100%; height : 100%",
            content: "<table class=\"table\" id=\"UserTable\" class=\"table table-striped table-bordered table-sm\" cellspacing=\"0\" width=\"100%\">" +
                "        <thead>\n" +
                "        <tr>\n" +
                "            <th scope=\"id\">#</th>\n" +
                "            <th>Primer Nombre</th>\n" +
                "            <th>Segundo Nombre</th>\n" +
                "            <th>Primer Apellido</th>\n" +
                "            <th>Segundo Apellido</th>\n" +
                "            <th>Estado</th>\n" +
                "        </tr>\n" +
                "        </thead>\n" +
                "</table>"
        });

        var verUserBtn = new Button({
            label: "Ver Listado de Usuario",
            onClick: function() {
                UserDialog.show();
                getPersons();
            },
            style: "position: absolute; top: 10px; right: 565px;"
        }, "btnUser").startup();




        var btnDept;
        map = new Map({
            basemap: "topo-vector"
        });

        var renderer = {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: "cyan",
                style: "solid",
                outline: {
                    color: "cyan",
                    width: 1
                }
            }
        };


        var deptPopup = {
            "title": "Información de {DPTO_CNMBRE}",
            "content": [
                {
                    "type": "fields",
                    "fieldInfos": [
                        {
                            "fieldName": "OBJECTID",
                            "label": "OBJECTID ",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_CCDGO",
                            "label": "Código DANE departamento",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_NANO_CREACION",
                            "label": "Año de creación del departamento",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_CNMBRE",
                            "label": "DPTO_CNMBRE",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_CACTO_ADMNSTRTVO",
                            "label": "Acto administrativo de creación del departamento",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_NAREA",
                            "label": "Área oficial del departamento en Km2",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTO_NANO",
                            "label": "Año vigencia de información municipal (Fuente DANE)",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        }
                    ]
                }]
        };

        global.loaderMap = function () {
            mapView = new MapView({
                container: "viewDiv",
                map: map,
                zoom: 6,
                center: [-72.4782449846235, 4.887407292289377]
            });
        };

        global.loaderMap();

        global.loaderDraw = function(){
            graphicsLayer = new GraphicsLayer();

            map.add(graphicsLayer);

            var sketchVM = new SketchViewModel({
                layer: graphicsLayer,
                view: mapView,
                polygonSymbol: {
                    type: "simple-fill",
                    style: "none",
                    outline: {
                        color: "black",
                        width: 1
                    }
                }
            });

            sketchVM.on(["create"], function (event) {

                if (event.state === "complete") {
                    map.remove(map.layers.find(x => x.type === "graphics"));
                    mapView.on("click", function (event) {
                        if (mapView.popup.visible && stateMap) {
                            mapView.popup.visible = false;
                            //mapView.extent = extent;
                            stateMap = false;
                        }
                    });


                    //extent = mapView.extent;
                    if (depColLayer) {
                        document.getElementById("loading").style = "display: block";
                        setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 5000);
                        var query = depColLayer.createQuery();
                        query.geometry = event.graphic.geometry;
                        query.distance = 2;
                        query.units = "miles";
                        query.spatialRelationship = "intersects";  // this is the default
                        query.returnGeometry = true;
                        query.outFields = ["*"];


                        depColLayer.queryFeatures(query)
                            .then(function (response) {
                                mapView.when(function () {
                                    //var layer = depColLayer;
                                    //response.features[0].layer.renderer = renderer;
                                    stateMap = true;
                                    mapView.extent = response.features[0].geometry.extent;
                                    deptPopup.location = mapView.center.clone();
                                    response.features[0].popupTemplate = new PopupTemplate(deptPopup);
                                    mapView.popup.features = [response.features[0]];
                                    mapView.popup.visible = true;
                                    //layer.renderer = renderer;
                                    //console.log(response.features)
                                });
                            });


                    }
                }
            });

            var sketch = new Sketch({
                view: mapView,
                viewModel: sketchVM,
                layer: graphicsLayer,
                creationMode: "single"
            });

            mapView.ui.add(sketch, "top-left");

            homeBtn = new Home({
                view: mapView
            });
        };

        global.loaderDraw();

        global.verMapaDepartamentos = function () {


            var nomColLabel = {
                symbol: {
                    type: "text",
                    color: "white",
                    haloColor: "black",
                    haloSize: "1px",
                    font: {
                        size: "12px",
                        family: "Noto Sans",
                        style: "italic",
                        weight: "normal"
                    }
                },
                labelPlacement: "above-center",
                labelExpressionInfo: {
                    expression: "$feature.DPTO_CNMBRE"
                }
            };

            depColLayer = new FeatureLayer({
                url: "https://ags.esri.co/server/rest/services/DA_DANE/departamento_mgn2016/MapServer/",
                outFields: ["*"],//["OBJECTID","DPTOMPIO", "NOMBRE_VER", "FUENTE", "NOMB_MPIO", "NOM_DEP", "COD_DPTO"],
                opacity: .4,
                labelingInfo: [nomColLabel],
                popupTemplate: deptPopup
            });
            map.add(depColLayer);

        };

        global.verMapaDepartamentos();


        var verPopup = {
            "title": "Información de {NOMBRE_VER}",
            "content": [
                {
                    "type": "fields",
                    "fieldInfos": [
                        {
                            "fieldName": "OBJECTID",
                            "label": "Id",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DPTOMPIO",
                            "label": "DPTOMPIO",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "CODIGO_VER",
                            "label": "CODIGO_VER",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "NOM_DEP",
                            "label": "NOM_DEP",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "NOMB_MPIO",
                            "label": "NOMB_MPIO",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "NOMBRE_VER",
                            "label": "NOMBRE_VER ",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "VIGENCIA",
                            "label": "VIGENCIA",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "FUENTE",
                            "label": "FUENTE",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "DESCRIPCIO",
                            "label": "DESCRIPCIO",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "SEUDONIMOS",
                            "label": "SEUDONIMOS",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "AREA_HA",
                            "label": "AREA_HA",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        },
                        {
                            "fieldName": "COD_DPTO",
                            "label": "COD_DPTO",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "text-box"
                        }
                    ]
                }]
        };

        global.verMapaVeredas = function () {
            var nomColLabel = {
                symbol: {
                    type: "text",
                    color: "white",
                    haloColor: "black",
                    haloSize: "1px",
                    font: {
                        size: "12px",
                        family: "Noto Sans",
                        style: "italic",
                        weight: "normal"
                    }
                },
                labelPlacement: "above-center",
                labelExpressionInfo: {
                    expression: "$feature.NOMBRE_VER"
                }
            };

            VerColLayer = new FeatureLayer({
                url: "https://ags.esri.co/server/rest/services/DA_DatosAbiertos/VeredasColombia/MapServer/0",
                outFields: ["*"],//["OBJECTID","DPTOMPIO", "NOMBRE_VER", "FUENTE", "NOMB_MPIO", "NOM_DEP", "COD_DPTO"],
                opacity: .4,
                labelingInfo: [nomColLabel],
                //definitionExpression: "NOM_DEP = 'Cesar'",
                popupTemplate: verPopup,
            });


            const query = { // autocasts as Query
                where: "1=1",
                returnGeometry: false,
                outFields: ["*"],//["OBJECTID","DPTOMPIO", "NOMBRE_VER", "FUENTE", "NOMB_MPIO", "NOM_DEP", "COD_DPTO"],

            };
            VerColLayer.queryFeatures(query).then(function (results) {
                if (table.length === 0) {
                    results.features.forEach(x => {
                        table.push({
                            "OBJECTID": x.attributes.OBJECTID,
                            "DPTOMPIO": x.attributes.DPTOMPIO,
                            "NOMBRE_VER": x.attributes.NOMBRE_VER,
                            "FUENTE": x.attributes.FUENTE,
                            "NOMB_MPIO": x.attributes.NOMB_MPIO,
                            "NOM_DEP": x.attributes.NOM_DEP,
                            "COD_DPTO ": x.attributes.COD_DPTO,
                            "ShapeArea": x.attributes["Shape.STArea()"],
                            "ShapeLength": x.attributes["Shape.STLength()"]
                        });
                    });
                }
                mapView.extent = results.features[0].geometry.extent;
                $.notify("Veredas cargadas");
            });
            map.add(VerColLayer);
        };

        global.verVereda = function (name) {

            deptDialog.hide();


            var nomColLabel = {
                symbol: {
                    type: "text",
                    color: "white",
                    haloColor: "black",
                    haloSize: "1px",
                    font: {
                        size: "12px",
                        family: "Noto Sans",
                        style: "italic",
                        weight: "normal"
                    }
                },
                labelPlacement: "above-center",
                labelExpressionInfo: {
                    expression: "$feature.NOMBRE_VER"
                }
            };

            verColLayer1 = new FeatureLayer({
                url: "https://ags.esri.co/server/rest/services/DA_DatosAbiertos/VeredasColombia/MapServer/0",
                outFields: ["*"],
                opacity: .5,
                renderer: renderer,
                popupTemplate: verPopup,
                labelingInfo: [nomColLabel],
                definitionExpression: `NOMBRE_VER = '` + name + `'`
            });

            map.add(verColLayer1);
            verColLayer1.queryFeatures({
                where: `NOMBRE_VER = '` + name + `'`,
                returnGeometry: true,
                outFields: ["*"]
            }).then(function (results) {
                mapView.extent = results.features[0].geometry.extent;
                document.getElementById("loading").style = "display: block";
                setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 5000);
            });

        };

        deptDialog = new Dialog({
            title: "Veredas",
            style: "width: 100%; height : 100%",
            content: "<table class=\"table\" id=\"VeredasTable\" class=\"table table-striped table-bordered table-sm\" cellspacing=\"0\" width=\"100%\">" +
                "        <thead>\n" +
                "        <tr>\n" +
                "            <th scope=\"id\">#</th>\n" +
                "            <th>Vereda</th>\n" +
                "            <th>Departamento</th>\n" +
                "            <th>Municipio</th>\n" +
                "            <th>Shape.STArea</th>\n" +
                "            <th>Shape.STLength</th>\n" +
                "            <th>Acciones</th>\n" +
                "        </tr>\n" +
                "        </thead>\n" +
                "</table>",

        });


        btnDept = Button({
            label: "Cargar departamentos ...",
            onClick: function () {
                document.getElementById("loading").style = "display: block";
                setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 10000);
                global.loaderMap();
                global.loaderDraw();
                global.verMapaDepartamentos();
            },
            style: "position: absolute; top: 10px; right: 370px;"
        }, "btnDept").startup();


        var btnVeredas = Button({
            label: "Cargar Veredas .....",
            onClick: function () {
                if(table.length > 0){
                    $.notify("Cargado....","success");
                }else{
                    document.getElementById("loading").style = "display: block";
                    setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 10000);
                    global.verMapaVeredas();

                }

            }, style: "position: absolute; top: 10px; right: 220px;"
        }, "btnVeredas").startup();

        var verDeptList = new Button({
            label: "Ver Listado de Veredas ....",
            onClick: function () {

                if(table.length > 0){
                    document.getElementById("loading").style = "display: block";
                    setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 1000);

                    if (!$.fn.dataTable.isDataTable('#VeredasTable')) {
                        for (var i in table) {
                            table[i].action = "<span onclick='return global.verVereda(" + JSON.stringify(table[i].NOMBRE_VER) + ")' data-tooltip=\"Presiona click para realizar zoom en el mapa para la vereda seleccionada.\" data-tooltip-position=\"left\"><i class='fa fa-search' title='Presiona click para realizar zoom en el mapa para la vereda seleccionada.'></i></span>";
                        }

                        $('#VeredasTable').DataTable(
                            {
                                data: table,
                                columns: [
                                    {data: 'OBJECTID'},
                                    {data: 'NOMBRE_VER'},
                                    {data: 'NOM_DEP'},
                                    {data: 'NOMB_MPIO'},
                                    {data: 'ShapeArea'},
                                    {data: 'ShapeLength'},
                                    {data: 'action'},
                                ]
                            }
                        );
                    }

                    deptDialog.show();


                    $('.dataTables_length').addClass('bs-select');
                }else{
                    $.notify("Debes cargar las veredas primero");
                }

            },
            style: "position: absolute; top: 10px; right: 20px;"
        }, "btnList").startup();

    });


document.getElementById("loading").style = "display: block";
setTimeout(function(){ document.getElementById("loading").style = "display: none"; }, 10000);

