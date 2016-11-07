(function ($, app, window) {

	'use strict';

	const _MATERIAS = {
		1 : {
			    "id": 1,
			    "nombre": "App web",
			    "profesores":[
			    	"Diego Martinez",
			    	"Sebastian Schanz",
			    	"Diego Vanhasteer"
			    ],
			    "temas_de_referencia": [],
			    "notas": {
	    	  		
	    	  			1: { // el id de la nota
	    	  				id: 1,
	    	  				texto: 'Nota por defecto APP WEB',
							numero_de_semana: 1,
							tema_de_referencia: 'PHP'
	    	  			}
	    	  	}
		},
		2: {
			    "id": 2,
			    "nombre": "Paradigmas",
			    "profesores":[
			        "Gloria Bianchi",
			    ],
			    "temas_de_referencia": [],
			    "notas": {
	    	  			4: { // el id de la nota
	    	  				id: 4,
	    	  				texto: 'Nota por defecto Paradigmas',
							numero_de_semana: 1,
							tema_de_referencia: 'Test'
	    	  			},
	    	  			5: { // el id de la nota
	    	  				id: 5,
	    	  				texto: 'Otra nota de la misma semana',
							numero_de_semana: 1,
							tema_de_referencia: 'Test'
	    	  			},
	    	  			2: { // el id de la nota
	    	  				id: 2,
	    	  				texto: 'Nota por defecto Paradigmas 2',
							numero_de_semana: 2,
							tema_de_referencia: 'Test'
	    	  			}
	    	  	}
		},
		3: {
			    "id": 3,
			    "nombre": "Simulacion",
			    "profesores":[
			        "Claudia Lopez"
			    ],
			    "temas_de_referencia": [],
			    "notas": {
		  			3: { // el id de la nota
		  				id: 3,
		  				texto: 'Nota por defecto de simulacion',
						numero_de_semana: 1,
						tema_de_referencia: 'Simula'
		  			},
			    	
			    }
		},
	};

	app.Materias = {

	    materiaPorId: function(materia_id){
	    	/*
				Retorna la promesa de buscar una materia por id
				using ES6 Promises...

				Ejemplo de uso:
					NOTEVOICE.Materias.materiaPorId(3).then((materia) => {
	                    console.log("Materia "+materia.nombre);
	                });
					NOTEVOICE.Materias.materiaPorId("3").then((materia) => {
	                    console.log("Materia "+materia.nombre);
	                });
	    	*/
	    	// debugger;
			return localforage.getItem('materias').then(function(materias) {
			    var promise = new Promise(function(resolve, reject) {
					if ( materias.length == 0 ) {
						reject(Error("No encontre la materia length 0"));
					};
					if ( materia_id in materias ) {
						// cuando encontramos la materia, resolvemos la promesa:
						resolve( materias[ materia_id ] );
					}
					else {
						// si no encontramos el id de la materia, reject la promesa:
						reject(Error("No encontre la materia. ID no existe"));
					}
				});
				return promise;
			})
	    },

	    proximo_id: function next_id() {
	    	/*
	    	 * Modo de uso:
	    	 * 		NOTEVOICE.Materias.proximo_id().then((id) => console.log(id))
	    	 */
			return localforage.getItem('materias').then(function(materias_object) {
				var materias = NOTEVOICE.Materias.materias_a_listado(materias_object);
				var promise = new Promise(function(resolve, reject) {
					if ( materias.length == 0 ) {
						resolve( 1 );
					};
					var ids = $.map(materias, function(materia, index) {
					    return [materia.id];
					});
					function getMaxOfArray(numArray) {
						return Math.max.apply(null, numArray);
					}

					resolve( getMaxOfArray(ids) + 1 );
				});
				return promise;
			})
	    },

	    addTemaDeReferencia: function addTemaDeReferencia(tema_de_referencia, a_que_materia_id) {
	        /*
	            Agrega un tema_de_referencia a la materia.
	        */
	        var materia = this.getMateriaById(a_que_materia_id);
	        materia.temas_de_referencia.push(tema_de_referencia);
	    },

	    buscar_todas: function buscarTodas () {
	    	/*
	    	 * Devuelve las materias de la base de datos,
	    	 * si no las encuentra, rejectea la promesa.
	    	 * 
	    	 * Return:
	    	 * 		Array de Materias.
	    	 */
	    	var promesa_de_buscar_todas = new Promise(function(resolve, reject) {
			  // do a thing, possibly async, then…
			  localforage.getItem('materias').then(
			  	(materias) => {
					if ( materias ) {
						/* Adaptamos el metodo a como se venia utilizando */
						resolve( app.Materias.materias_a_listado( materias ) );
					}
					else {
						reject(Error("No hay materias cargadas"));
					}	
			  	}
			  )
			});

			return promesa_de_buscar_todas;
	    },

	    materias_a_listado: function materias_a_listado( materias ) {
	    	/*
	    	 * Pasa el diccionario de materias que se guarda en la base,
	    	 * a un listado (array) de  materias.
	    	 */
			var listado_de_materias = [];
			for ( var m in materias){
				listado_de_materias.push( materias[ m ]);
			}

			return listado_de_materias;
	    	
	    },

	    llenar_la_base: function llenarLaBase () {
	    	/*
	    	 * Carga la Base de Datos.
	    	 * Las materias que se cargan son las materias en _MATERIAS.
	    	 */
	    	var promesa_de_llenar_la_base = new Promise(function(resolve, reject) {
			  // do a thing, possibly async, then…
			  localforage.setItem('materias', _MATERIAS).then(
			  	(materias) => {
					if ( materias ) {
						/* everything turned out fine */
						resolve( app.Materias.materias_a_listado( materias ) );
					}
					else {
						reject(Error("No se pudo cargar materias"));
					}	
			  	}
			  )
			});

			return promesa_de_llenar_la_base;

	    },

	    guardar_materia: function guardar_materia (materia_a_guardar) {
	    	/*
	    	 * Guarda la materia_a_guardar en la Base de Datos.
	    	 * .
	    	 */
			var insertar_materia_en_base = new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…
				localforage.getItem('materias').then(
					(materias) => {
						materias[ materia_a_guardar.id ] = materia_a_guardar;
						var promesa_nueva = new Promise( (resolve, reject) => {
							localforage.setItem('materias', materias).then(
									(materias) => {
										resolve(materia_a_guardar);
									});
						})
						resolve(promesa_nueva);
					}
				)
			});
			return insertar_materia_en_base;	    	
	    },

	    notas_de_materia: function notes_for_matery(materia_id) {
	    	/*
	    	 Devuelve un objeto con clase del 1 al 15 en la que se agrupan
	    	 las notas por semana:
	    	 Por ejemplo

	    	 {
	    	 	1: [ nota1, nota2,...],
	    	 	2:
	    	 	...
	    	 	15: [ notaN, notaN2,...],
	    	 }

	    	 USAGE:
	    	 	NOTEVOICE.Materias.notas_de_materia(1).then( (semanas) => console.log(semanas))
	    	*/
			var clasificar_notas_por_semana = new Promise(function(resolve, reject) {
		    	app.Materias.materiaPorId(materia_id)
		    		.then(
		    			( materia ) => {
					    	var semanas = {
					    		1: [],
					    		2: [],
					    		3: [],
					    		4: [],
					    		5: [],
					    		6: [],
					    		7: [],
					    		8: [],
					    		9: [],
					    		10: [],
					    		11: [],
					    		12: [],
					    		13: [],
					    		14: [],
					    		15: [],
					    	};
					    	// debugger;
				    		for( var nota_id in materia.notas ){
				    			let nota = materia.notas[ nota_id];
				    			semanas[ nota.numero_de_semana ].push( nota );
				    		}
				    		resolve( semanas );
				    	}
				    )  // fin then
					.catch(
						() => resolve({
				    		1: [],
				    		2: [],
				    		3: [],
				    		4: [],
				    		5: [],
				    		6: [],
				    		7: [],
				    		8: [],
				    		9: [],
				    		10: [],
				    		11: [],
				    		12: [],
				    		13: [],
				    		14: [],
				    		15: [],
				    	})
					)
	    	});

	    	return clasificar_notas_por_semana;
	    }, // fin notas_de_materia
	    
	    _todas_las_notas: function _all_notes() {
	    	/*
	    	 * NOTEVOICE.Materias._todas_las_notas().then((notas) => console.log(notas))
	    	 */
			var promesa_todas_las_notas = new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…
				localforage.getItem('materias').then(
					(materias) => {
						var notas_todas = [];
						for( var materia_id in materias ){
							var notas = $.map(materias[materia_id].notas, function(nota, index) {
							    return [nota];
							});
							for( var nota_index in notas){
								notas_todas.push(notas[nota_index])
							}
						}
						resolve(notas_todas);
					}
				)
			});
			return promesa_todas_las_notas;	    	

	    },


	    proximo_id_de_notas: function next_id_of_notes() {
	    	/*
	    	 * NOTEVOICE.Materias.proximo_id_de_notas().then((id) => console.log(id))
	    	 */
			var promesa_de_proximo_id_de_nota = new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…
	    		app.Materias._todas_las_notas().then(
	    			(notas) => {
	    				if (notas.length == 0)
	    					resolve(1);
	    				else{
		    				var notas_ids = $.map(notas, function(nota, index) {
							    return [nota.id];
							});
							function getMaxOfArray(numArray) {
								return Math.max.apply(null, numArray);
							}

							resolve( getMaxOfArray(notas_ids) + 1 );
	    				}
	    			})
			});
			return promesa_de_proximo_id_de_nota;	    	
	    },

	    notas_que_contiene_el_texto: function notes_that_contains_the_text( que_texto ) {
	    	/*
	    	 * Devuelve las notas que en su texto contienen que_texto.
	    	 * 
	    	 * Return:
	    	 * 		Array de notas que cumplen el criterio.
	    	 * 		
	    	 * Ejemplo:
	    	 * 		NOTEVOICE.Materias.notas_que_contiene_el_texto("Paradigmas").then( (notas) => console.log(notas))
	    	 */
			var promesa_de_las_notas = new Promise(function(resolve, reject) {
				// do a thing, possibly async, then…
	    		app.Materias._todas_las_notas().then(
	    			(notas) => {
	    				var notas_que_cumplen = [];
	    				for (var i = notas.length - 1; i >= 0; i--) {
	    					var nota = notas[i];
		    				if ( nota.texto.toLowerCase().indexOf(que_texto) != -1 )
		    					notas_que_cumplen.push(nota);
	    				}
	    				resolve( notas_que_cumplen );
	    			})
			});
			return promesa_de_las_notas;	    	
	    },

  	    materia_que_contiene_la_nota: function(nota_id){
	    	/*
				Retorna la promesa de buscar una materia que en sus notas contenga
				la nota con el id recibido
				using ES6 Promises...

				Ejemplo de uso:
					NOTEVOICE.Materias.materia_que_contiene_la_nota(3).then((materia) => {
	                    console.log("Materia "+materia.nombre);
	                });
	    	*/
	    	
			return this
				.buscar_todas()
				.then( function(materias) {
				    var promise = new Promise(function(resolve, reject) {
						if ( materias.length == 0 ) {
							reject(Error("No encontre la materia length 0"));
						}
						for (var i = materias.length - 1; i >= 0; i--) {
							var materia_i = materias[i];
							if ( nota_id in materia_i.notas ) {
								// cuando encontramos la materia, resolvemos la promesa:
								resolve( materia_i );
							}
						}
						reject(Error("No encontre la nota en ninguna materia. ID no existe"));
					});
					return promise;
				})
	    },




	};
	
}(jQuery, NOTEVOICE, undefined));