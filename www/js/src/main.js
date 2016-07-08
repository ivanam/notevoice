/*
 * Aplicacion!
 */

var notevoice_app = {
    // Application Constructor
    initialize: function() {
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
        var $listado_de_materias = $(".listado__de__materias"),
            template_materia_en_lista = "<dt><a href='#materia_{{id}}'> {{nombre}}</dt>",

            template_materia_page = $("#materia__page__template").text();


        for (var i = materias.length - 1; i >= 0; i--) {
            var html_materia_en_lista = Mustache.to_html(template_materia_en_lista, materias[i]),
                html_materia_page = Mustache.to_html(template_materia_page, materias[i]);

            // console.log(html_materia_en_lista);
            $listado_de_materias.append(html_materia_en_lista);
            $("body").append(html_materia_page);
        };

    },

};


