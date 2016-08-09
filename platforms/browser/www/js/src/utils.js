function btn_new_profesor(){
	//maqueta de input para agregar otro profesor y boton para eliminarlo
	var input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>"+
					 "<input type='text' placeholder='Nombre del Profesor' value='' class='text-profesor'></div>";
	var btn_eliminar = "<span class='ui-icon-minus ui-btn-icon-notext ui-corner-all ui-btn-right' onclick='btn_delete(this)'>";
	
	//Se agregar el input despues del ulitmo que existe y el boton antes del reciente agregado
	$(input_text).insertAfter($(".text-profesor").last().parent());
	$(btn_eliminar).insertBefore($(".text-profesor").last().parent());
	// $(".ui-input-text").last().css("width","85%");
}

function btn_delete(elemento){
	elemento.previousElementSibling.remove();
	elemento.remove();
}

function agregar_materia(){
	var profesores = [];
	$( ".text-profesor" ).each(function() {
		profesores.push($(this)[0].value);
	});
	
	var materia = {
		    "id": $("#text-id").val(),
		    "nombre": $("#text-nombre").val(),
		    "profesores": profesores,
		    "temas_de_referencia": [ //TODO tienen que ser 15 semanas en las cuales se almacenan las notas
		    	{
		    		"semana": 1,
		    		"notas": []
		    	},
		    	{
		    		"semana": 2,
		    		"notas": []
		    	},
		    	{
		    		"semana": 3,
		    		"notas": []
		    	},
		    	{
		    		"semana": 4,
		    		"notas": []
		    	}
		    ]
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
	$.mobile.changePage($("#listadoMaterias"));
}