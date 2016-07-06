(function ($, app, window) {

	'use strict';

	app.Notas = {
	    all: function all() {
	    // retorna una promesa de notas:
	        return localforage.getItem('notas');
	    },
	    getNotaById: function(nota_id){
    	/*
			Retorna la promesa de buscar una nota por id
			using ES6 Promises...
    	*/
			return this.all().then(function(notas) {
			    // This code runs once the materias has been loaded
			    // from the offline store.
			    var nota_encontrada;
			    var promesa = new Promise(function(resolve, reject) {
					// do a thing, possibly async, then…
					for(var i=0, nota = notas[0]; nota = notas[i]; i++){
		                var mismoId = nota.id === nota_id;
		                if( mismoId )
		                	nota_encontrada = nota; 
		            }
					if (nota_encontrada) {
						// cuando encontramos la nota, resolvemos la promesa:
						resolve(nota_encontrada);
					}
					else {
						// si no encontramos la promesa, reject la promesa:
						reject(Error("No encontre la nota"));
					}
				});
				return promesa;
			})
	    },

	    addTemaDeReferencia: function addTemaDeReferencia(tema_de_referencia, a_que_materia_id) {
        /*
            Agrega un tema_de_referencia a la materia.
        */
	        var materia = this.getMateriaById(a_que_materia_id);
	        materia.temas_de_referencia.push(tema_de_referencia);
	    }

	};
	
}(jQuery, PROYECTO, undefined));