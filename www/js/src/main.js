/*
 * Aplicacion!
 */

var notevoice_app = {
    CURRENT_MATERIA_ID: -1,
    // Application Constructor
    initialize: function() {
        /*
         * Busca las materias y las dibuja en el index.
         * Si las materias no existen en la base, las carga. 
         */
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
        this.enlazar_eventos();
    },

    dibujar_materias: function (materias) {
        /*
         * Dibuja el listado de materias y las pages de mas materias en el index.
         */
        var $listado_de_materias = $(".listado__de__materias"),  // elemento del DOM donde van las materias listadas.
            template_materia_en_lista = "<dt><a href='#materia_{{id}}' class='ver_semanas' materia-id={{id}}> {{nombre}}</dt>",  // template de un item materia, en el listado
            // ^-- si se desea cambiar la reprresentacion de una materia en el listado, tocar esta var.
            template_materia_page = $("#materia__page__template").text();  // template de una page (jQuery mobile) para una materia
            // ^-- este template tenemos que ir a buscarlo al index porque es un template mas grande como para tenerlo en un String.
        
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

    enlazar_eventos: function bind_events() {
        $("#nueva_materia").click(this.nueva_materia);
        $(".ver_notas").click(this.ver_notas);
        $("#new_profesor").click(this.nuevo_profesor);
        $(".btn_delete").click(this.eliminar_inputs);
        $("#agregar_materia").click(this.agregar_materia);
        setTimeout(function() {
            $(".ver_semanas").click(notevoice_app.ver_semanas);    
        }, 500);
    },

    nueva_materia: function nueva_materia () {
        $.mobile.changePage($("#altaMateria"));
    },

    ver_notas: function ver_notas () {
        var semana = $(this).attr("id");
        console.log("Ver notas de la semana: "+semana+" materia: "+notevoice_app.CURRENT_MATERIA_ID);
    },
    
    ver_semanas: function ver_semanas () {
        var materia_id = $(this).attr("materia-id");
        notevoice_app.CURRENT_MATERIA_ID = materia_id;
    },

    eliminar_inputs: function eliminar_inputs(){
        console.log("eliminando boton");
        // $(this).previousElementSibling.remove();   $(this) tiene que sel el elemento del boton con clase btn_delete que haya sido clickeado
        // $(this).remove();
    },

    nuevo_profesor: function nuevo_profesor () {
        //maqueta de input para agregar otro profesor y boton para eliminarlo
        var input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"+
                         "<input type='text' placeholder='Nombre del Profesor' value='' class='text-profesor'></div>";
        var btn_eliminar = "<span class='ui-icon-minus ui-btn-icon-notext ui-corner-all ui-btn-right btn_delete'>";
        
        $(input_text).insertAfter($(".text-profesor").last().parent());
        $(btn_eliminar).insertBefore($(".text-profesor").last().parent());
    },

    agregar_materia: function agregar_materia () {
        var profesores = [];
        $( ".text-profesor" ).each(function() {
            profesores.push($(this)[0].value);
        });
        
        var materia = {
                "id": $("#text-id").val(),
                "nombre": $("#text-nombre").val(),
                "profesores": profesores,
                "temas_de_referencia": []
        };
        NOTEVOICE.Materias.guardar_materia(materia)
            .then(  // luego, cuando vengan las materias:
                (materias) => {
                    notevoice_app.dibujar_materias(materias);
                    console.log("Se agrego una materia");
                }
            )  // fin then;
            .catch(  // en caso de que haya error:
                () => {
                    console.log("Error al cargar materia");
                });
        notevoice_app.limpiar_alta_materia();
        $.mobile.changePage($("#listadoMaterias"));
    },

    limpiar_alta_materia: function limpiar_alta_materia(){
        $("#text-id")[0].value = "";
        $("#text-nombre")[0].value = "";
        $(".text-profesor")[0].value = "";
    }
};


