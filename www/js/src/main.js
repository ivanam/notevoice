/*
 * Aplicacion!
 */

var notevoice_app = {
    
    // Application Constructor
    initialize: function() {
    
        /*
            Se inicializa variables para controlar semana y materia en la
            que se encuentra transitando la aplicacion
        */
        localStorage.setItem("materia_actual", -1);
        localStorage.setItem("semana_actual", -1);

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
            // template_materia_en_lista = "<dt><a href='#materia_{{id}}' class='ver_semanas' materia-id={{id}}> {{nombre}}</dt>",  // template de un item materia, en el listado
            template_materia_en_lista = "<li><a href='#materia_{{id}}' class='ver_semanas' data-materiaid={{id}}>{{nombre}}</a></li>",
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
            $listado_de_materias.listview("refresh");
            // - Toda la page de materias:
            $("body").append(html_materia_page);
        };

    },

    enlazar_eventos: function bind_events() {
        $("#nueva_materia").click(this.nueva_materia);
        $(".ver_notas").click(this.ver_notas);
        $("#new_profesor").click(this.nuevo_profesor);
        $("#agregar_materia").click(this.agregar_materia);
        setTimeout(function() {
            $(".ver_semanas").click(notevoice_app.ver_semanas);    
        }, 500);
        $("#btn-grabar-note-voice").click(this.manejador_grabacion);
        $("#guardar_nota").click(this.guardar_nota_en_base);
    },

    nueva_materia: function nueva_materia () {
        localStorage.setItem("cantProfesor",1);
        $.mobile.changePage($("#altaMateria"));
    },

    ver_notas: function ver_notas () {
        var semana = $(this).attr("id");
        var nombre = $(this).text();
        localStorage.setItem("semana_actual", semana);
        $("#titulo_semana").text(nombre);


        NOTEVOICE.Notas.all().then(function(notas){

            var $listado_de_notas = $(".listado__de__notas"),  // elemento del DOM donde van las materias listadas.
                template_nota_en_lista = "<li><a href='#' class='click_nota' data-notaid={{id}}>{{tema_de_referencia}}</a></li>";
                
            $listado_de_notas.empty();

            for(id in notas){
                var html_nota_en_lista = Mustache.to_html(template_nota_en_lista, notas[id]);

                $listado_de_notas.append(html_nota_en_lista);
            }
            $listado_de_notas.listview("refresh");
            $(".click_nota").click(notevoice_app.cargar_Nota);
        })
    },
    
    ver_semanas: function ver_semanas () {
        var materia_id = $(this).data('materiaid');
        localStorage.setItem("materia_actual", materia_id);
    },

    eliminar_inputs: function eliminar_inputs(){
        $(this)[0].previousElementSibling.remove();  // $(this) tiene que sel el elemento del boton con clase btn_delete que haya sido clickeado
        $(this)[0].remove();
    },

    nuevo_profesor: function nuevo_profesor () {
        var cant = parseInt(localStorage.getItem("cantProfesor"));
        //maqueta de input para agregar otro profesor y boton para eliminarlo
        var input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"+
                         "<input type='text' placeholder='Nombre del Profesor' value='' class='text-profesor'></div>";
        var btn_eliminar = "<span id='delete_profesor_"+cant+"' class='ui-icon-minus ui-btn-icon-notext ui-corner-all ui-btn-right btn_delete'>";
        
        $(input_text).insertAfter($(".text-profesor").last().parent());
        $(btn_eliminar).insertBefore($(".text-profesor").last().parent());
        $("#delete_profesor_"+cant).click(notevoice_app.eliminar_inputs);
        localStorage.setItem("cantProfesor", cant+1);
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
    },

    manejador_grabacion: function comerzar_captura() {
        var maxMatches = 1;
        var promptString = "Hable Ahora!"; // optional
        var language = "es-AR";                     // optional
        window.plugins.speechrecognizer.startRecognize(function(result){
            $('#nota_semana').text(localStorage.getItem("semana_actual"));
            $('#nota_materia').text(localStorage.getItem("materia_actual"));
            notevoice_app.verificar_nota(result);
            $.mobile.changePage($("#notaTranscripcion"));

        }, function(errorMessage){
            console.log("Error message: " + errorMessage);
        }, maxMatches, promptString, language);
    },

    guardar_nota_en_base: function guardar_nota_en_base () {
        var nota = $('#nota_transcripcion').text();
        var materia = $('#nota_transcripcion').data('materia');
        var semana = $('#nota_transcripcion').data('semana');
        console.log("Guardando materia: "+materia+" semana: "+semana+" nota: "+nota);
    },

    verificar_nota: function verificar_nota(nota) {
        var exist_tema = nota.indexOf("tema");
        var exist_nota = nota.indexOf("nota");
        if (exist_tema != -1)
            $('#nota_tema').text(nota.substring(exist_tema+5,exist_nota-1));
        else{
            //en caso que no se haya dicho la palabra tema
            //aca faltaria implementar que alternativa tomar
            console.log("No dijo la palabra tema");
        }

        if (exist_nota != -1)
            $('#nota_transcripcion').text(nota.substring(exist_nota+5,nota.length));
        else{
            //en caso que no se haya dicho la palabra nota
            //aca faltaria implementar que alternativa tomar
            console.log("No dijo la palabra nota");
        }
    },

    cargar_Nota: function cargar_Nota() {
        var id = $(this).data('notaid');
        NOTEVOICE.Notas.getNotaById(id).then((nota)=>{
            $("#nota_detalle").text(nota.texto);
            $.mobile.changePage($("#detalleNota"));        
        }).catch(  // en caso de que haya error:
                () => {
                    console.log("Error al buscar la nota");
                });
    }
};


