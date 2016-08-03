function btn_new_profesor(){
	var input_text = "<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' placeholder='Nombre del Profesor' value='' class='text-profesor'></div>";
	$(input_text).insertAfter($(".text-profesor").last().parent());
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
		    "temas_de_referencia": []
	};
	NOTEVOICE.Materias.guardar_materia(materia)
		.then(  // luego, cuando vengan las materias:
            (materias) => {
                console.log("Se agrego una materia");
            }
        )  // fin then;
        .catch(  // en caso de que haya error:
            () => {
                console.log("Error al cargar materia");
            });
	$.mobile.changePage($("#listadoMaterias"));
}