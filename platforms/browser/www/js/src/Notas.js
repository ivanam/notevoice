(function ($, app, window) {

	'use strict';

	app.Notas = {
	    
	    /*
	     * Nota:
	     * 		- id
	     * 		- texto
	     * 		- numero_de_semana
	     * 		- tema_de_referencia
	     * 		- materia_id
	     */
	    
	    all: function all() {
	    	/* Retorna una promesa de notas:
	    	 * Las notas en la base tienen la siguiente estructura:
	    	 * 
	    	 * 		{
	    	 * 		
	    	 * 			1: { // el id de la nota
	    	 * 				id: 1,
	    	 * 				texto: 'Nota tal...'
	    	 * 			},
	    	 * 			2: {
	    	 * 				id: 2,
	    	 * 				texto: 'Nota tal...'
	    	 * 			},
	    	 * 		}
	    	 * 		
	    	 * 	USAGE:
	    	 * 	
	    	 * 		NOTEVOICE.Notas.all().then( (notas) => { console.log(notas);} )
	    	 * 		
	    	 */
	        return localforage.getItem('notas');
	    },
	    
	    getNotaById: function(nota_id){
	    	/*
	    	 * Retorna la promesa de buscar una nota por id
	    	 * using ES6 Promises...
	    	 */
			return this.all().then(function(notas) {
				// This code runs once the materias has been loaded
			    // from the offline store.
			    var nota_encontrada;
			    var promesa = new Promise(function(resolve, reject) {
					// do a thing, possibly async, then…
					if(nota_id in notas){
						nota_encontrada = notas[nota_id]; 
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
	         * Agrega un tema_de_referencia a la materia.
	         */
	        var materia = this.getMateriaById(a_que_materia_id);
	        materia.temas_de_referencia.push(tema_de_referencia);
	    },

	    guardarNota: function save_note(nota_a_guardar) {
	    	/*
	    	 * Recibe un objeto nota y lo guarda en la base.
	    	 * Si la nota existe se actualiza TODO: Probar esto! ... funciona! actualiza...
	    	 * 
	    	 * USAGE:
	    	 * 		nota = { 'id': 1, 'texto': "Prueba 1", 'numero_de_semana': 1, 'tema_de_referencia': "Test", 'materia_id': 1}
	    	 * 		NOTEVOICE.Notas.guardarNota(nota).then( (nota) => { console.log("NOTA NUEVA:"); console.log(nota); });
	    	 * 
	    	 */
    		return this.all().then(function(notas) {
			    var promise = new Promise(function(resolve, reject) {
					// do a thing, possibly async, then…
					if ( $.isEmptyObject(notas) ) {
						console.log("Inicializando notas!");
						notas = {};
					}
					notas[nota_a_guardar.id] = nota_a_guardar;
					localforage.setItem('notas', notas).then( () => {
						resolve(nota_a_guardar);
					});
					// resolvemos la promesa:
				});
				return promise;
			});
	    }

	};

	// localforage.setItem('notas', {}).then( () => {
	// 	console.log("Notas setup OK!");
	// });
	
}(jQuery, NOTEVOICE, undefined));