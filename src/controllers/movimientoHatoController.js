const controller = {};

controller.list = (req, res) => {
   //const { id } = req.params;
   const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM hato', (erro, movimiento_hatos) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
           //conn.query('SELECT * FROM _vw_ganado WHERE idHato = ?',[id],  (erro, animales) => {
               conn.query('SELECT * FROM _vw_ganado', (erro, animales) => { // WHERE idHato = (SELECT MIN(idHato) FROM hato)
               if (err) {
                   //next(err); // enviarlo a un middleware de error caon express
                   res.json(err);
               }
           
               res.render('movimiento_hatos', {
                   data: movimiento_hatos,
                   dataAnimal : animales
               });
           });    

        });
    });
};




//controller.moveAnimal = (req, res) => {
//    const { id } = req.params;
//    const newAnimal = req.body;
//    req.getConnection((err, conn) => {
//        conn.query('UPDATE animal set ? WHERE idanimal = ?',[newAnimal,id], (err, animal) => {
//            console.log(err);
//            res.redirect('/movimiento_hatos');
//        });
//    });
//};


controller.updateAnimalHato = (req, res) => {
    const { hatoOrigen, hatoDestino, selectedAnimals } = req.body;

    if (!hatoOrigen || !hatoDestino || !selectedAnimals) {
        return res.status(400).send('Faltan datos para mover animales.');
    }

    if (hatoOrigen === hatoDestino) {
        return res.status(400).send('El hato origen y destino deben ser diferentes.');
    }

    const ids = selectedAnimals.split(',').map(x => x.trim()).filter(x => x !== '');
    if (ids.length === 0) {
        return res.status(400).send('Debe seleccionar al menos un animal.');
    }

    const idsCsv = ids.join(',');

    req.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error de conexión.');
        }

        conn.query('CALL _SP_update_hato_animal(?, ?, ?)', [hatoOrigen, hatoDestino, idsCsv], (err, result) => {
            if (err) {
                console.error('Error al ejecutar SP _SP_update_hato_animal:', err);
                return res.status(500).send('Error al actualizar animales.');
            }

            res.redirect('/movimiento_hatos');
        });
    });
};
    
    
    
    
    
    
    //const { id } = req.params; // si necesitas un parámetro adicional
    //const selectedAnimals = req.body.newAnimal; // esto es un array de números
//
    //// Convertimos el array en una cadena separada por comas
    //const animalList = selectedAnimals.join(',');
//
    //req.getConnection((err, conn) => {
    //    if (err) {
    //        console.error('Error de conexión:', err);
    //        return res.status(500).send('Error de conexión');
    //    }
//
    //    // Llamamos al procedimiento almacenado con la lista
    //    conn.query('CALL _SP_update_hato_animal(?)', [animalList], (err, result) => {
    //        if (err) {
    //            console.error('Error al ejecutar el SP:', err);
    //            return res.status(500).send('Error al mover animales');
    //        }
//
    //        res.redirect('/movimiento_hatos');
    //    });
    //});




module.exports = controller;