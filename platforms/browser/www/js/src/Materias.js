(function ($, app, window) {

	'use strict';

	const _MATERIAS = [
		{
		    "id": 1,
		    "nombre": "App web",
		    "profesores":[
		    	"Diego Martinez",
		    	"Sebastian Schanz"
		    ],
		    "temas_de_referencia": []
		},
		{
		    "id": 2,
		    "nombre": "Paradigmas",
		    "profesores":[
		        "Gloria Bianchi",
		    ],
		    "temas_de_referencia": []
		},
		{
		    "id": 3,
		    "nombre": "Simulacion",
		    "profesores":[
		        "Claudia Lopez"
		    ],
		    "temas_de_referencia": []
		},
	];

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
			return this.buscar_todas().then(function(materias) {
			    // This code runs once the materias has been loaded
			    // from the offline store.
			    var materia_encontrada;
			    var promise = new Promise(function(resolve, reject) {
					// do a thing, possibly async, then…
					if ( materias.length == 0 ) {
						reject(Error("No encontre la materia length 0"));
					};
					for(var i=0, materia = materias[0]; materia = materias[i]; i++){
		                var mismoId = materia.id == materia_id;
		                if( mismoId )
		                	materia_encontrada = materia; 
		            }
					if (materia_encontrada) {
						// cuando encontramos la materia, resolvemos la promesa:
						resolve(materia_encontrada);
					}
					else {
						// si no encontramos la promesa, reject la promesa:
						reject(Error("No encontre la materia"));
					}
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
	    	 */
	    	var promesa_de_buscar_todas = new Promise(function(resolve, reject) {
			  // do a thing, possibly async, then…
			  localforage.getItem('materias').then(
			  	(materias) => {
					if ( materias ) {
						/* everything turned out fine */
						resolve(materias);
					}
					else {
						reject(Error("No hay materias cargadas"));
					}	
			  	}
			  )
			});

			return promesa_de_buscar_todas;
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
						resolve(materias);
					}
					else {
						reject(Error("No se pudo cargar materias"));
					}	
			  	}
			  )
			});

			return promesa_de_llenar_la_base;

	    },

	    guardar_materia: function guardar_materia (materia) {
	    	/*
	    	 * Guarda la materia en la Base de Datos.
	    	 * .
	    	 */
			var insertar_materia_en_base = new Promise(function(resolve, reject) {
			  // do a thing, possibly async, then…
			  localforage.getItem('materias').then(
			  	(materias) => {
					if ( materias ) {
						/* everything turned out fine */
						materias.push(materia);
						var promesa_nueva = new Promise( (resolve, reject) => {
							localforage.setItem('materias', materias).then(
			  					(materias) => {
			  						resolve(materias);
			  					});
						})

						resolve(promesa_nueva);
					}
					else {
						reject(Error("No se pudo cargar materias"));
					}	
			  	}
			  )
			});
			return insertar_materia_en_base;	    	
	    }

	};
	
}(jQuery, NOTEVOICE, undefined));