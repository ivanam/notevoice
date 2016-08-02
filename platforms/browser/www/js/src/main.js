/*
 * Aplicacion!
 */

var notevoice_app = {
    // Application Constructor
    initialize: function() {
        /*
         * Busca las materias y las dibuja en el index.
         * Si las materias no existen en la base, las carga. 
         */
        this.enlanzarEventos();
        NOTEVOICE.Materias.buscar_todas()
            .then(  // luego, cuando vengan las materias:
                (materias) => {
                    this.dibujar_materias(materias);
                }
            )  // fin then;
            .catch(  // en caso de que haya error:
                () => {
                    console.log("No habia materias...");
                    NOTEVOICE.Materias.llenar_la_base()
                        .then(
                            (materias) => {
                                console.log("luego de cargar la base!");
                                this.dibujar_materias(materias);
                            }
                        )
                }
            )  // fin catch;
    },

    dibujar_materias: function (materias) {
        /*
         * Dibuja el listado de materias y las pages de mas materias en el index.
         */
        var $listado_de_materias = $(".listado__de__materias"),  // elemento del DOM donde van las materias listadas.
            template_materia_en_lista = "<dt><a href='#materia_{{id}}'> {{nombre}}</dt>",  // template de un item materia, en el listado
            // ^-- si se desea cambiar la reprresentacion de una materia en el listado, tocar esta var.
            template_materia_page = $("#materia__page__template").text();  // template de una page (jQuery mobile) para una materia
            // ^-- este template tenemos que ir a buscarlo al index porque es un template mas grande como para tenerlo en un String.
        
        // borrar el listado para redibujarlo:
        $listado_de_materias.empty();
        // Por cada materia:
        for (var i = materias.length - 1; i >= 0; i--) {
            // Cargar los templates:
            var html_materia_en_lista = Mustache.to_html(template_materia_en_lista, materias[i]),
                html_materia_page = Mustache.to_html(template_materia_page, materias[i]);

            // Y appendearlo a los elementos del DOM correspondientes:
            // - Item al listado de materias:
            $listado_de_materias.append(html_materia_en_lista);
            // - Toda la page de materias:
            $("body").append(html_materia_page);
        };

    },

    enlanzarEventos: function bindEvents () {
        $("#nueva_materia").click(
            () => {
                console.log("click");
                NOTEVOICE.Materias.guardar_materia(
                    { 
                        id: 16,
                        nombre: "DESDE BOTON"
                    })
                    .then((materias) => {
                        this.dibujar_materias(materias);
                    });
            });
    }

};


