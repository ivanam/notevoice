(function ($, app, window) {

	'use strict';

	app.Materias = {
	    all: function all() {
	        // retorna una promesa de materias:
	        return localforage.getItem('materias')
				.then(this.analizar_materias);
	    },
	    analizar_materias: function analizar_materias(materias){
	    	console.log("Ohh que lindas materias", materias);
			var promise = new Promise( (resolve, reject) => {
				if (materias) {
					resolve(materias);
				}
				reject("Hubo un error");
			});
	    	return promise;
			// var promise = new Promise( (resolve, reject) => {
	  //       	if (materias) {
   //  				console.log("Ya existian materias...");
   //  				resolve(materias);
   //  			}else{
   //  				var nuevas_materias = [
			//             {
			//                 "id": 1,
			//                 "nombre": "App web",
			//                 "profesores":[
			//                 	"Diego Martinez"
			//                 ],
			//                 "temas_de_referencia": []
			//             },
			//             {
			//                 "id": 2,
			//                 "nombre": "Paradigmas",
			//                 "profesores":[
			//                     "Gloria Bianchi",
			//                 ],
			//                 "temas_de_referencia": []
			//             },
			//             {
			//                 "id": 3,
			//                 "nombre": "Simulacion",
			//                 "profesores":[
			//                     "Claudia Lopez"
			//                 ],
			//                 "temas_de_referencia": []
			//             },
			//         ];
			//         // Unlike localStorage, you can store non-strings.
			// 		localforage.setItem('materias', materias)
			// 			.then( (las_materias) => {
			// 				console.log("Materias a salvo...");
			// 			})
			// 		resolve(nuevas_materias);
   //  			}
			// });
			// return promise;
			// }
	    },
	    create_all: function crear_materias() {
	        console.log("Poblar base de datos...");
	        // TODO: Las materias se pueden buscar en otro lado...
	        var materias = [
	            {
	                "id": 1,
	                "nombre": "App web",
	                "profesores":[
	                	"Diego Martinez"
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
	        // Unlike localStorage, you can store non-strings.
			localforage.setItem('materias', materias).then(function(value) {
			    console.log("Materias cargadas con exito:", value);
			}).catch(function(err) {
			    // This code runs if there were any errors
			    console.log(err);
			});
	    },
	    getMateriaById: function(materia_id){
    	/*
			Retorna la promesa de buscar una materia por id
			using ES6 Promises...
    	*/
			return this.all().then(function(materias) {
			    // This code runs once the materias has been loaded
			    // from the offline store.
			    var materia_encontrada;
			    var promise = new Promise(function(resolve, reject) {
					// do a thing, possibly async, then…
					if ( materia.length ) {
						reject(Error("No encontre la materia"));
					};
					for(var i=0, materia = materias[0]; materia = materias[i]; i++){
		                var mismoId = materia.id === materia_id;
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
	    }

	};
	
}(jQuery, PROYECTO, undefined));