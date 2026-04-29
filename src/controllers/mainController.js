const controller = {};

controller.list = (req, res) => {
    
    //res.send('hello world');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM raza', (erro, main) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
            res.render('main', {
                data: main
            });
        });
    });
};


module.exports = controller;