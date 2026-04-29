const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Asegúrate de que la carpeta 'uploads' exista
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Instancia de multer (¡ahora está definida correctamente!)
const upload = multer({ storage });

// Consulta usando la vista _vw_ganado
const ANIMAL_BASE_QUERY = `SELECT * FROM _vw_ganado`;

// Controlador
const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query(`${ANIMAL_BASE_QUERY} ORDER BY idAnimal DESC`, (err, animales) => {
            if (err) {
                return res.json(err);
            }
            conn.query('SELECT * FROM color', (erro, colores) => {
                if (erro) return res.json(erro);
                conn.query('SELECT * FROM raza', (erro, razas) => {
                    if (erro) return res.json(erro);
                    conn.query('SELECT * FROM ciclovital', (erro, ciclovitales) => {
                        if (erro) return res.json(erro);
                        conn.query('SELECT * FROM hato', (erro, hatos) => {
                            if (erro) return res.json(erro);
                            conn.query('SELECT * FROM finca', (erro, fincas) => {
                                if (erro) return res.json(erro);
                                conn.query('SELECT * FROM arete', (erro, aretes) => {
                                    if (erro) return res.json(erro);
                                    conn.query('SELECT * FROM estado_animal', (erro, estadosAnimal) => {
                                        if (erro) return res.json(erro);
                                        res.render('animales', {
                                            data: animales,
                                            dataColor : colores,
                                            dataRaza: razas,
                                            dataCiclovital: ciclovitales,
                                            dataHato: hatos,
                                            dataFinca: fincas,
                                            dataArete: aretes,
                                            dataEstadoAnimal: estadosAnimal
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    
    // Limpiar valores vacíos convirtiéndolos a NULL para campos INTEGER
    const integerFields = ['idEstadoAnimal', 'idArete', 'idRaza', 'idColor', 'idCicloVital', 'idAnimalPadre', 'idAnimalMadre', 'idHato', 'idFinca'];
    integerFields.forEach(field => {
        if (data[field] === '' || data[field] === null) {
            data[field] = null;
        }
    });

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO animal set ?',[data], (err, animal) => {
            //console.log(animal);
            if(err) throw err;
            res.redirect('/animales');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Connection error:', err);
            return res.json(err);
        }
        conn.query(`SELECT * FROM _vw_ganado WHERE idAnimal = ?`, [id], (err, animal) => {
            if (err) {
                console.error('Query error:', err);
                return res.json(err);
            }
            if (!animal || animal.length === 0) {
                console.error('Animal not found with id:', id);
                return res.status(404).json({error: 'Animal no encontrado'});
            }
            conn.query('SELECT * FROM raza', (erro, razas) => {
                if (erro) {
                    console.error('Error fetching razas:', erro);
                    return res.json(erro);
                }
                conn.query('SELECT * FROM color', (erro, colores) => {
                    if (erro) {
                        console.error('Error fetching colores:', erro);
                        return res.json(erro);
                    }
                    conn.query('SELECT * FROM ciclovital', (erro, ciclovitales) => {
                        if (erro) {
                            console.error('Error fetching ciclovitales:', erro);
                            return res.json(erro);
                        }
                        conn.query('SELECT * FROM hato', (erro, hatos) => {
                            if (erro) {
                                console.error('Error fetching hatos:', erro);
                                return res.json(erro);
                            }
                            conn.query('SELECT * FROM finca', (erro, fincas) => {
                                if (erro) {
                                    console.error('Error fetching fincas:', erro);
                                    return res.json(erro);
                                }
                                conn.query('SELECT * FROM animal', (erro, animales) => {
                                    if (erro) {
                                        console.error('Error fetching animales:', erro);
                                        return res.json(erro);
                                    }
                                    conn.query('SELECT * FROM arete', (erro, aretes) => {
                                        if (erro) {
                                            console.error('Error fetching aretes:', erro);
                                            return res.json(erro);
                                        }
                                        conn.query('SELECT * FROM estado_animal', (erro, estadosAnimal) => {
                                            if (erro) {
                                                console.error('Error fetching estado_animal:', erro);
                                                return res.json(erro);
                                            }
                                            res.render('animal_edit', {
                                                data: animal[0],
                                                dataRaza: razas,
                                                dataColor : colores,
                                                dataCiclovital: ciclovitales,
                                                dataHato: hatos,
                                                dataFinca: fincas,
                                                dataAnimal: animales,
                                                dataArete: aretes,
                                                dataEstadoAnimal: estadosAnimal
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newAnimal = req.body;
    
    // Limpiar valores vacíos convirtiéndolos a NULL para campos INTEGER
    const integerFields = ['idEstadoAnimal', 'idArete', 'idRaza', 'idColor', 'idCicloVital', 'idAnimalPadre', 'idAnimalMadre', 'idHato', 'idFinca'];
    integerFields.forEach(field => {
        if (newAnimal[field] === '' || newAnimal[field] === null) {
            newAnimal[field] = null;
        }
    });
    
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Connection error:', err);
            return res.json(err);
        }
        conn.query('UPDATE animal set ? WHERE idAnimal = ?',[newAnimal,id], (err, animal) => {
            if (err) {
                console.error('Update error:', err);
                return res.json(err);
            }
            res.redirect('/animales');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('DELETE FROM animal WHERE idAnimal = ?',[id], (err, rows) => {
            if (err) {
                console.error('Error deleting animal:', err);
                res.json(err);
                return;
            }
            res.redirect('/animales');
        });
    });
};


controller.importcsv = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error al subir el archivo', detalle: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const filePath = req.file.path;
    const resultados = [];

    console.log('Contenido CSV:', filePath);
    const csv = require('fast-csv');
 
  fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: false }))
    .on('error', (error) => {
      console.error('Error leyendo el archivo CSV:', error.message);
      res.status(500).json({ error: 'Error leyendo el archivo' });
    })
    .on('data', (row) => {
      resultados.push(row); // cada row será un array de columnas
    })
    .on('end', async () => {
      try {
        const connection = await new Promise((resolve, reject) =>
          req.getConnection((err, conn) => (err ? reject(err) : resolve(conn)))
        );

        for (const row of resultados) {
          await new Promise((resolve, reject) => {
            const query = 'CALL _SP_insert_animal (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            connection.query(query, row, (err) => {
              if (err) {
                console.error('Error ejecutando SP:', err.sqlMessage);
              }
              resolve(); // continúa aunque haya errores por fila
            });
          });
        }

        res.redirect('/animales');
      } catch (err) {
        console.error('Error general:', err.message);
        res.status(500).json({ error: 'Error al procesar los datos del archivo' });
      }
    });

  });
};

module.exports = controller;
