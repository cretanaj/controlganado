USE ganadodb;

/*
  Truncado de animal y tablas relacionadas por FK
  Nota: TRUNCATE reinicia AUTO_INCREMENT.
*/
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE compra_venta_ganado;
TRUNCATE TABLE palpacion;
TRUNCATE TABLE parto;
TRUNCATE TABLE celo;
TRUNCATE TABLE sintomas_bovinos;
TRUNCATE TABLE vacunacion;
TRUNCATE TABLE pesaje;
TRUNCATE TABLE finca_hato;
TRUNCATE TABLE hato;
TRUNCATE TABLE animal;

SET FOREIGN_KEY_CHECKS = 1;
