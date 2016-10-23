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
            // template_materia_en_lista = "<dt><a href='#materia_{{id}}' class='abrir_materia' materia-id={{id}}> {{nombre}}</dt>",  // template de un item materia, en el listado
            template_materia_en_lista = "<li><a href='#materia_{{id}}' class='abrir_materia' data-materiaid={{id}}>{{nombre}}</a></li>",
            // ^-- si se desea cambiar la reprresentacion de una materia en el listado, tocar esta var.
            template_materia_page = $("#materia__page__template").text();  // template de una page (jQuery mobile) para una materia
            // ^-- este template tenemos que ir a buscarlo al index porque es un template mas grande como para tenerlo en un String.
        
        $listado_de_materias.empty();
        $(".pages_delete_materia").remove();
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
        $(".modificar_materia").click(this.cargar_modificar_materia);
        $("#eliminar_materia").click(this.eliminar_materia_de_base);

        setTimeout(function() {
            // desfazado porque la clase ver_semana pertenece a elementos
            // dinamicos!
            $(".abrir_semana").click(notevoice_app.on__abrir_semana);
        }, 500);

    },

    enlazar_eventos: function bind_events() {
        $("#nueva_materia").click(this.nueva_materia);
        // $(".ver_notas").click(this.ver_notas);
        $("#new_profesor").click(this.nuevo_profesor);
        $("#new_profesor_mod").click(this.nuevo_profesor_mod);
        $("#agregar_materia").click(this.agregar_materia);
        setTimeout(function() {
            // desfazado porque la clase ver_semana pertenece a elementos
            // dinamicos!
            $(".abrir_materia").click(notevoice_app.abrir_materia);    
        }, 500);
        $("#btn-grabar-note-voice").click(this.manejador_grabacion);
        $("#guardar_nota").click(this.guardar_nota_en_base);
        $("#ver_notas").click(this.cargar_notas_de_la_materia);
        $("#guardar_materia_modificada").click(this.guardar_materia_modificada);
        $("#event_limpiar_mod_materia").click(this.limpiar_mod_materia);
    },

    nueva_materia: function nueva_materia () {
        localStorage.setItem("cantProfesor",1);
        $.mobile.changePage($("#altaMateria"));
    },

    cargar_modificar_materia: function cargar_modificar_materia() {
        notevoice_app.limpiar_mod_materia();

        var template_input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset delete_input'>"+
                         "<input type='text' placeholder='Nombre del Profesor' value='{{text-profesor}}' class='text-profesor-mod'></div>";
        var template_btn_eliminar = "<span id='delete_profesor_mod_{{id}}' class='ui-icon-minus ui-btn-icon-notext ui-corner-all ui-btn-right btn_delete_mod'>";
        NOTEVOICE.Materias.materiaPorId(localStorage.getItem("materia_actual"))
            .then( (materia)=> {
                $("#text-id-mod").val(materia.id);
                $("#text-nombre-mod").val(materia.nombre);
                $("#nombre_profesor_mod").val(materia.profesores[0]);
                for (var id in materia.profesores) {
                    if (id != 0) {
                        // debugger;
                        var html_profesor = Mustache.to_html(template_input_text, {"text-profesor":materia.profesores[id]});
                        var html_btn_delete = Mustache.to_html(template_btn_eliminar, {"id":id});
                        $(html_profesor).insertAfter($(".text-profesor-mod").last().parent());
                        $(html_btn_delete).insertBefore($(".text-profesor-mod").last().parent());
                        $("#delete_profesor_mod_"+id).click(notevoice_app.eliminar_inputs);
                    }
                }
                localStorage.setItem("cantProfesorMod",materia.profesores.length);
            })
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
    
    abrir_materia: function abrir_materia () {
        var materia_id = $(this).data('materiaid');
        localStorage.setItem("materia_actual", materia_id);
        notevoice_app.cargar_notas_de_la_materia(); //puenteo temporal
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

    nuevo_profesor_mod: function nuevo_profesor_modificacion () {
        var cant = parseInt(localStorage.getItem("cantProfesorMod"));
        //maqueta de input para agregar otro profesor y boton para eliminarlo
        var input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset delete_input'>"+
                         "<input type='text' placeholder='Nombre del Profesor' value='' class='text-profesor-mod'></div>";
        var btn_eliminar = "<span id='delete_profesor_mod_"+cant+"' class='ui-icon-minus ui-btn-icon-notext ui-corner-all ui-btn-right btn_delete_mod'>";
        
        $(input_text).insertAfter($(".text-profesor-mod").last().parent());
        $(btn_eliminar).insertBefore($(".text-profesor-mod").last().parent());
        $("#delete_profesor_mod_"+cant).click(notevoice_app.eliminar_inputs);
        localStorage.setItem("cantProfesorMod", cant+1);
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

    guardar_materia_modificada: function guardar_materia_modificada() {
        var id_materia = $("#text-id-mod").val();
        var nombre_materia = $("#text-nombre-mod").val();
        var profesores = [];
        $( ".text-profesor-mod" ).each(function() {
            profesores.push($(this)[0].value);
        });

        /* Se comienza a armar la materia con los datos nuevos
        el ID, los temas de referencia y las notas no pueden
        ser modificadas desde aca */
        var materia_mod = {
            "id": id_materia,
            "nombre": nombre_materia,
            "profesores": profesores
        };

        NOTEVOICE.Materias.materiaPorId(id_materia)
            .then( (materia)=> {
                materia_mod['temas_de_referencia'] = materia.temas_de_referencia;
                materia_mod['notas'] = materia.notas;
                NOTEVOICE.Materias.guardar_materia(materia_mod)
                    .then( () => {
                        //una vez que se guardaron los cambios recupero todas para dibujar nuevamente
                        NOTEVOICE.Materias.buscar_todas()
                            .then(
                                (materias) => {
                                    notevoice_app.dibujar_materias(materias);
                                    $.mobile.changePage($("#listadoMaterias"));
                                }
                            );  // fin then
                    })  // fin then;
                    .catch(  // en caso de que haya error:
                        () => {
                            console.log("Error al guardar cambios en materia");
                        });
            })
            .catch( ()=>{
                console.log("Error, no se encontro la materia");
            });
    },

    limpiar_alta_materia: function limpiar_alta_materia(){
        $("#text-id")[0].value = "";
        $("#text-nombre")[0].value = "";
        $(".text-profesor")[0].value = "";
    },

    limpiar_mod_materia: function limpiar_modificacion_de_materia(){
        $("#text-id-mod")[0].value = "";
        $("#text-nombre-mod")[0].value = "";
        var profesor_base = $("#nombre_profesor_mod")[0].value = "";
        $(".btn_delete_mod").remove();
        $(".delete_input").remove();
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

    verificar_nota: function verificar_nota(resultado) {
        var nota = resultado[0];
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
    },

    cargar_notas_de_la_materia: function cargar_notas_de_la_materia() {
        console.log("ON: cargar_notas_de_la_materia");
        var materia_id= localStorage.getItem("materia_actual"); // 
        console.log("ON: cargar_notas_de_la_materia -> a la promesa...");
        // debugger;
        NOTEVOICE.Materias.notas_de_materia(materia_id).then(
            (semanas) => {
                console.log("ON: cargar_notas_de_la_materia -> then de la promesa...");
                // for( var numero_de_semana in semanas){
                //     cargar_semana_con_notas(semanas[numero_de_semana], "#semana"+numero_de_semana);
                // }
                localStorage.setItem("notas_por_semana_actual", JSON.stringify( semanas ));
            }
        )

        function cargar_semana_con_notas(notas_de_semana, selector_de_semana) {
            //con mustache iterar e insertar las notas de la semana en el selector
            $(selector_de_semana).empty();
            $(selector_de_semana).append(notas_de_semana);
        }
    },

    on__abrir_semana: function on__open_week() {
        console.log("abrir semana!");
        console.log($(this).attr("semana-id"));
        id_semana_seleccionada = $(this).attr("semana-id");
        localStorage.setItem("semana_actual",id_semana_seleccionada);
        var notas_de_la_semana = JSON.parse( localStorage.getItem("notas_por_semana_actual") )[id_semana_seleccionada];
        $(".listado__de__notas").empty();
        console.log("notas de la semana");
        console.log(notas_de_la_semana);
        for (var i = notas_de_la_semana.length - 1; i >= 0; i--) {
            nota = notas_de_la_semana[i];
            $(".listado__de__notas").append("<li> texto de la nota: "+nota.texto+"</li>");
        }
        $(".listado__de__notas").listview("refresh");
    },

    eliminar_materia_de_base: function eliminar_materia_de_base() {
        var id_materia_seleccionada = localStorage.getItem("materia_actual");
        NOTEVOICE.Materias.materiaPorId(id_materia_seleccionada)
            .then( 
                (materia)=> {   
                    var materias_sin_eliminada = {};
                    NOTEVOICE.Materias.buscar_todas().then(
                        (materias) => {
                            for (var i in materias){
                                if (materias[i].id != id_materia_seleccionada) {
                                    materias_sin_eliminada[materias[i].id] = materias[i];
                                }
                            }
                            localforage.setItem('materias', materias_sin_eliminada)
                                .then((materias)=>{
                                    notevoice_app.dibujar_materias(materias);
                                });
                        });  // fin then
                    $.mobile.changePage($("#listadoMaterias"));
            }).catch( ()=>{
                console.log("Error: materia seleccionada no existe");
            });
    }
};


