function factoryNotas(unidad, nota){
	var nota = {
		unidad: unidad,
		nota: nota,
		info: function info() {
			return "Nota: "+ this.nota + "unidad: " + this.unidad;
 		}
	}
	return nota;
}

identificador = 0;
function factoryMaterias(nombre, profesor){
	var materia = {
		id: identificador++,
		notas: [],
		nombre: nombre,
		profesor: profesor,
		info: function info() {
			return  this.nombre + "' - profesor: " + this.profesor;
 		},
 		add_nota: function add_nota(nueva_nota) {
 			this.notas.push(nueva_nota);
 		}
	}
	return materia;
}

notas = [];
nota1 = factoryNotas("UNIDAD 1", "Nota 1...");
nota2 = factoryNotas("UNIDAD 2", "Nota 1...");
nota3 = factoryNotas("UNIDAD 2", "Nota 2...");
nota4 = factoryNotas("UNIDAD 3", "Nota 1...");
notas.push(nota1);
notas.push(nota2);
notas.push(nota3);
notas.push(nota4);
console.log("cargar notas...");

materias = [];
materia1 = factoryMaterias("TNT", "Diego Firmenich");
materia1.add_nota(nota1);
materia2 = factoryMaterias("App web", "Diego Martinez");
materia3 = factoryMaterias("Paradigmas", "Gloria Bianchi");
materia4 = factoryMaterias("Simulacion", "Claudia Lopez");

materias.push(materia1);
materias.push(materia2);
materias.push(materia3);
materias.push(materia4);

for (var i = 0, materia = materias[0]; materia = materias[i]; i++) {
	listado = $(".listado-de-materias");
	listado.append("<button>" +materia.info() +"<strong> ver notas </strong> </button>");
	console.log("MATERIA:", materia);
}