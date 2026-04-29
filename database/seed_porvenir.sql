USE ganadodb;

START TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE finca_hato;
TRUNCATE TABLE hato;
TRUNCATE TABLE animal;
TRUNCATE TABLE arete;
TRUNCATE TABLE compra_venta_ganado;
TRUNCATE TABLE pesaje;
TRUNCATE TABLE parto;
TRUNCATE TABLE celo;

SET FOREIGN_KEY_CHECKS = 1;

/*
  Seed simple por inserts regulares.
  Reusa finca Porvenir (idFinca = 2 segun tus datos actuales).
*/

/* OBTENER IDS NECESARIOS */
SET @idCicloVital_Ternero = 1;
SET @idCicloVital_Toro = 4;
SET @idCicloVital_Vaca = 5;
SET @idRaza_Brahman = (SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%BRAHMAN%' LIMIT 1);
SET @idRaza_Angus = COALESCE((SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%ANGUS%' LIMIT 1), @idRaza_Brahman);
SET @idRaza_Gyr = COALESCE((SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%GYR%' LIMIT 1), (SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%GIR%' LIMIT 1), @idRaza_Brahman);
SET @idRaza_Nelore = COALESCE((SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%NELORE%' LIMIT 1), @idRaza_Brahman);
SET @idRaza_Simmental = COALESCE((SELECT idraza FROM raza WHERE UPPER(nombre) LIKE '%SIMMENTAL%' LIMIT 1), @idRaza_Brahman);
SET @idColor_Blanco = (SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%BLANC%' LIMIT 1);
SET @idColor_Gris = COALESCE((SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%GRIS%' LIMIT 1), @idColor_Blanco);
SET @idColor_Negro = COALESCE((SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%NEGR%' LIMIT 1), @idColor_Blanco);
SET @idColor_Rojo = COALESCE((SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%ROJ%' LIMIT 1), @idColor_Blanco);
SET @idColor_Cafe = COALESCE((SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%CAF%' LIMIT 1), (SELECT idcolor FROM color WHERE UPPER(nombre) LIKE '%MARR%' LIMIT 1), @idColor_Blanco);
SET @idEstadoAnimal_Activo = (SELECT idEstadoAnimal FROM estado_animal WHERE UPPER(nombre) LIKE '%ACTIV%' LIMIT 1);
SET @idEstadoAnimal_Venta = COALESCE((SELECT idEstadoAnimal FROM estado_animal WHERE UPPER(nombre) LIKE '%VENT%' LIMIT 1), (SELECT idEstadoAnimal FROM estado_animal WHERE UPPER(nombre) LIKE '%VEND%' LIMIT 1));
SET @idEstadoAnimal_Muerto = COALESCE((SELECT idEstadoAnimal FROM estado_animal WHERE UPPER(nombre) LIKE '%MUERT%' LIMIT 1), (SELECT idEstadoAnimal FROM estado_animal WHERE UPPER(nombre) LIKE '%FALLEC%' LIMIT 1), @idEstadoAnimal_Venta);

SET @idFinca_Parcela = (
  SELECT idFinca
  FROM finca
  WHERE UPPER(nombre) = 'PARCELA' OR UPPER(codigo) = 'PARCELA'
  ORDER BY idFinca DESC
  LIMIT 1
);

/* HATOS NUEVOS DE PORVENIR */
INSERT INTO hato (nombre, codigo, descripcion) VALUES
('Porvenir Hato 1', 'PO-H1', 'Hato 1 de finca Porvenir'),
('Porvenir Hato 2', 'PO-H2', 'Hato 2 de finca Porvenir'),
('Porvenir Hato 3', 'PO-H3', 'Hato 3 de finca Porvenir'),
('Porvenir Hato 4', 'PO-H4', 'Hato 4 de finca Porvenir');

/* HATOS NUEVOS DE PARCELA */
INSERT INTO hato (nombre, codigo, descripcion) VALUES
('Parcela Hato 1', 'PA-H1', 'Hato 1 de finca Parcela'),
('Parcela Hato 2', 'PA-H2', 'Hato 2 de finca Parcela'),
('Parcela Hato 3', 'PA-H3', 'Hato 3 de finca Parcela');

SET @idHato_H1 = (SELECT idHato FROM hato WHERE codigo = 'PO-H1' ORDER BY idHato DESC LIMIT 1);
SET @idHato_H2 = (SELECT idHato FROM hato WHERE codigo = 'PO-H2' ORDER BY idHato DESC LIMIT 1);
SET @idHato_H3 = (SELECT idHato FROM hato WHERE codigo = 'PO-H3' ORDER BY idHato DESC LIMIT 1);
SET @idHato_H4 = (SELECT idHato FROM hato WHERE codigo = 'PO-H4' ORDER BY idHato DESC LIMIT 1);
SET @idHato_PA_H1 = (SELECT idHato FROM hato WHERE codigo = 'PA-H1' ORDER BY idHato DESC LIMIT 1);
SET @idHato_PA_H2 = (SELECT idHato FROM hato WHERE codigo = 'PA-H2' ORDER BY idHato DESC LIMIT 1);
SET @idHato_PA_H3 = (SELECT idHato FROM hato WHERE codigo = 'PA-H3' ORDER BY idHato DESC LIMIT 1);

/* TOROS PARCELA: 3 HATOS X 15 TOROS (ACTIVOS) */
INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
)
SELECT
  CONCAT(LPAD(500 + ((h.hatoOrden - 1) * 15) + n.n, 3, '0'), '/9') AS codigo,
  CONCAT('PA-T', h.hatoOrden, '-', LPAD(n.n, 2, '0')) AS codigoAlterno,
  DATE_ADD('2018-01-01', INTERVAL ((h.hatoOrden - 1) * 15 + n.n) DAY) AS fechaNacimiento,
  CONCAT(
    CONCAT(LPAD(500 + ((h.hatoOrden - 1) * 15) + n.n, 3, '0'), '/9'),
    ' - Toro'
  ) AS nombre,
  @idRaza_Brahman AS idRaza,
  CASE WHEN MOD(n.n, 2) = 0 THEN @idColor_Gris ELSE @idColor_Blanco END AS idColor,
  'Macho' AS sexo,
  'SEED_PARCELA_TORO' AS descripcion,
  @idEstadoAnimal_Activo AS idEstadoAnimal,
  DATE_ADD('2019-01-01', INTERVAL ((h.hatoOrden - 1) * 15 + n.n) DAY) AS fechaActivo,
  @idCicloVital_Toro AS idCicloVital,
  NULL AS idAnimalPadre,
  NULL AS idAnimalMadre,
  h.idHato AS idHato,
  @idFinca_Parcela AS idFinca,
  NULL AS idArete
FROM (
  SELECT 1 AS hatoOrden, @idHato_PA_H1 AS idHato
  UNION ALL
  SELECT 2 AS hatoOrden, @idHato_PA_H2 AS idHato
  UNION ALL
  SELECT 3 AS hatoOrden, @idHato_PA_H3 AS idHato
) h
CROSS JOIN (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
  UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
) n;

/* TOROS: 1 POR HATO (ACTIVOS) */
INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
) VALUES
('151/9', 'PO-T1', '2019-01-15', '151/9 - Toro', @idRaza_Brahman, @idColor_Blanco, 'Macho', 'SEED_PORVENIR_TORO', @idEstadoAnimal_Activo, '2020-01-10', @idCicloVital_Toro, NULL, NULL, @idHato_H1, 2, NULL),
('172/9', 'PO-T2', '2019-02-17', '172/9 - Toro', @idRaza_Brahman, @idColor_Gris, 'Macho', 'SEED_PORVENIR_TORO', @idEstadoAnimal_Activo, '2020-01-11', @idCicloVital_Toro, NULL, NULL, @idHato_H2, 2, NULL),
('193/9', 'PO-T3', '2019-03-19', '193/9 - Toro', @idRaza_Brahman, @idColor_Blanco, 'Macho', 'SEED_PORVENIR_TORO', @idEstadoAnimal_Activo, '2020-01-12', @idCicloVital_Toro, NULL, NULL, @idHato_H3, 2, NULL),
('214/9', 'PO-T4', '2019-04-21', '214/9 - Toro', @idRaza_Brahman, @idColor_Gris, 'Macho', 'SEED_PORVENIR_TORO', @idEstadoAnimal_Activo, '2020-01-13', @idCicloVital_Toro, NULL, NULL, @idHato_H4, 2, NULL);

/* TOROS INACTIVOS: 3 RETIRADOS */
INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, fechaInactivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
) VALUES
('251/9', 'PO-TI1', '2015-06-10', '251/9 - Toro', @idRaza_Angus, @idColor_Negro, 'Macho', 'SEED_PORVENIR_TORO_INACTIVO', @idEstadoAnimal_Venta, '2018-05-20', '2024-12-01', @idCicloVital_Toro, NULL, NULL, @idHato_H1, 2, NULL),
('272/9', 'PO-TI2', '2016-03-15', '272/9 - Toro', @idRaza_Gyr, @idColor_Rojo, 'Macho', 'SEED_PORVENIR_TORO_INACTIVO', @idEstadoAnimal_Venta, '2019-02-10', '2024-11-15', @idCicloVital_Toro, NULL, NULL, @idHato_H2, 2, NULL),
('293/9', 'PO-TI3', '2014-11-20', '293/9 - Toro', @idRaza_Nelore, @idColor_Blanco, 'Macho', 'SEED_PORVENIR_TORO_INACTIVO', @idEstadoAnimal_Venta, '2017-10-15', '2024-10-30', @idCicloVital_Toro, NULL, NULL, @idHato_H3, 2, NULL);

/* VACAS: 10 POR HATO */
INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
) VALUES
/* H1 */
('112/0', 'PO-V1-01', '2020-02-11', '112/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-02', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('163/0', 'PO-V1-02', '2020-03-16', '163/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-03', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('214/0', 'PO-V1-03', '2020-04-21', '214/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-04', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('265/0', 'PO-V1-04', '2020-05-26', '265/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-05', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('306/0', 'PO-V1-05', '2020-06-30', '306/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-06', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('48/0', 'PO-V1-06', '2020-08-04', '48/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-07', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('89/0', 'PO-V1-07', '2020-09-08', '89/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-08', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('131/0', 'PO-V1-08', '2020-01-13', '131/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-09', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('172/0', 'PO-V1-09', '2020-02-17', '172/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-10', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),
('213/0', 'PO-V1-10', '2020-03-21', '213/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-01-11', @idCicloVital_Vaca, NULL, NULL, @idHato_H1, 2, NULL),

/* H2 */
('123/0', 'PO-V2-01', '2020-03-12', '123/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-02', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('174/0', 'PO-V2-02', '2020-04-17', '174/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-03', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('225/0', 'PO-V2-03', '2020-05-22', '225/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-04', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('276/0', 'PO-V2-04', '2020-06-27', '276/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-05', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('18/0', 'PO-V2-05', '2020-08-01', '18/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-06', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('69/0', 'PO-V2-06', '2020-09-06', '69/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-07', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('101/0', 'PO-V2-07', '2020-01-10', '101/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-08', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('142/0', 'PO-V2-08', '2020-02-14', '142/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-09', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('193/0', 'PO-V2-09', '2020-03-19', '193/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-10', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),
('234/0', 'PO-V2-10', '2020-04-23', '234/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-02-11', @idCicloVital_Vaca, NULL, NULL, @idHato_H2, 2, NULL),

/* H3 */
('134/0', 'PO-V3-01', '2020-04-13', '134/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-02', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('185/0', 'PO-V3-02', '2020-05-18', '185/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-03', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('236/0', 'PO-V3-03', '2020-06-23', '236/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-04', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('278/0', 'PO-V3-04', '2020-08-27', '278/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-05', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('39/0', 'PO-V3-05', '2020-09-03', '39/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-06', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('81/0', 'PO-V3-06', '2020-01-08', '81/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-07', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('122/0', 'PO-V3-07', '2020-02-12', '122/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-08', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('163/0', 'PO-V3-08', '2020-03-16', '163/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-09', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('214/0', 'PO-V3-09', '2020-04-21', '214/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-10', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),
('255/0', 'PO-V3-10', '2020-05-25', '255/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-03-11', @idCicloVital_Vaca, NULL, NULL, @idHato_H3, 2, NULL),

/* H4 */
('145/0', 'PO-V4-01', '2020-05-14', '145/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-02', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('196/0', 'PO-V4-02', '2020-06-19', '196/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-03', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('248/0', 'PO-V4-03', '2020-08-24', '248/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-04', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('299/0', 'PO-V4-04', '2020-09-29', '299/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-05', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('71/0', 'PO-V4-05', '2020-01-07', '71/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-06', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('112/0', 'PO-V4-06', '2020-02-11', '112/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-07', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('153/0', 'PO-V4-07', '2020-03-15', '153/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-08', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('194/0', 'PO-V4-08', '2020-04-19', '194/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-09', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('245/0', 'PO-V4-09', '2020-05-24', '245/0 - Vaca', @idRaza_Brahman, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-10', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL),
('286/0', 'PO-V4-10', '2020-06-28', '286/0 - Vaca', @idRaza_Brahman, @idColor_Gris, 'Hembra', 'SEED_PORVENIR_VACA', @idEstadoAnimal_Activo, '2022-04-11', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL);

INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, fechaInactivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
) VALUES
('317/0', 'PO-VM-01', '2019-07-12', '317/0 - Vaca', @idRaza_Brahman, @idColor_Cafe, 'Hembra', 'SEED_PORVENIR_VACA_MUERTA', @idEstadoAnimal_Muerto, '2021-02-15', '2025-12-10', @idCicloVital_Vaca, NULL, NULL, @idHato_H4, 2, NULL);

SET @idAnimal_251_9 = (SELECT idAnimal FROM animal WHERE codigo = '251/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_151_9 = (SELECT idAnimal FROM animal WHERE codigo = '151/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_172_9 = (SELECT idAnimal FROM animal WHERE codigo = '172/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_193_9 = (SELECT idAnimal FROM animal WHERE codigo = '193/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_214_9 = (SELECT idAnimal FROM animal WHERE codigo = '214/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_272_9 = (SELECT idAnimal FROM animal WHERE codigo = '272/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_293_9 = (SELECT idAnimal FROM animal WHERE codigo = '293/9' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_112_0 = (SELECT idAnimal FROM animal WHERE codigo = '112/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_163_0 = (SELECT idAnimal FROM animal WHERE codigo = '163/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_214_0 = (SELECT idAnimal FROM animal WHERE codigo = '214/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_265_0 = (SELECT idAnimal FROM animal WHERE codigo = '265/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_123_0 = (SELECT idAnimal FROM animal WHERE codigo = '123/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_174_0 = (SELECT idAnimal FROM animal WHERE codigo = '174/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_225_0 = (SELECT idAnimal FROM animal WHERE codigo = '225/0' ORDER BY idAnimal ASC LIMIT 1);
SET @idAnimal_276_0 = (SELECT idAnimal FROM animal WHERE codigo = '276/0' ORDER BY idAnimal ASC LIMIT 1);

/* CELOS PARA TODAS LAS VACAS DE PORVENIR */
INSERT INTO celo (idAnimalVaca, idAnimalToro, fechaInicio, fechaFin, observacion)
SELECT
  a.idAnimal AS idAnimalVaca,
  t.idAnimal AS idAnimalToro,
  DATE_SUB(CURDATE(), INTERVAL (45 + MOD(a.idAnimal * 7, 120)) DAY) AS fechaInicio,
  DATE_ADD(
    DATE_SUB(CURDATE(), INTERVAL (45 + MOD(a.idAnimal * 7, 120)) DAY),
    INTERVAL (1 + MOD(a.idAnimal * 5, 3)) DAY
  ) AS fechaFin,
  CONCAT('Celo seed vaca Porvenir ', a.codigoAlterno) AS observacion
FROM animal a
INNER JOIN animal t
  ON t.idHato = a.idHato
  AND t.sexo = 'Macho'
  AND t.descripcion = 'SEED_PORVENIR_TORO'
WHERE a.idHato IN (@idHato_H1, @idHato_H2, @idHato_H3, @idHato_H4)
  AND a.sexo = 'Hembra'
  AND a.descripcion LIKE 'SEED_PORVENIR_VACA%';

INSERT INTO estado_parto (codigo, nombre)
SELECT 'VIVO', 'Parto vivo'
WHERE NOT EXISTS (
  SELECT 1 FROM estado_parto WHERE UPPER(codigo) = 'VIVO' OR UPPER(nombre) LIKE '%VIVO%'
);

SET @idEstadoParto_Actual = COALESCE(
  (SELECT idEstadoParto FROM estado_parto WHERE UPPER(codigo) LIKE '%VIV%' LIMIT 1),
  (SELECT idEstadoParto FROM estado_parto WHERE UPPER(nombre) LIKE '%VIV%' LIMIT 1),
  (SELECT idEstadoParto FROM estado_parto WHERE UPPER(nombre) LIKE '%NORMAL%' LIMIT 1),
  (SELECT idEstadoParto FROM estado_parto ORDER BY idEstadoParto ASC LIMIT 1)
);

/* TERNEROS SOLO EN 2 HATOS: H1 Y H2 */
INSERT INTO animal (
  codigo, codigoAlterno, fechaNacimiento, nombre,
  idRaza, idColor, sexo, descripcion, idEstadoAnimal,
  fechaActivo, idCicloVital, idAnimalPadre, idAnimalMadre,
  idHato, idFinca, idArete
) VALUES
/* H1: Con padre (toro inactivo) y madre (vaca) */
('122/5', 'PO-C1-01', '2025-02-12', '122/5 - Ternero', @idRaza_Angus, @idColor_Negro, 'Hembra', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-02-12', @idCicloVital_Ternero,
  @idAnimal_251_9,
  @idAnimal_112_0,
  @idHato_H1, 2, NULL),
('213/5', 'PO-C1-02', '2025-03-21', '213/5 - Ternero', @idRaza_Gyr, @idColor_Rojo, 'Macho', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-03-21', @idCicloVital_Ternero,
  @idAnimal_151_9,
  @idAnimal_163_0,
  @idHato_H1, 2, NULL),
('94/5', 'PO-C1-03', '2025-04-09', '94/5 - Ternero', @idRaza_Nelore, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-04-09', @idCicloVital_Ternero,
  @idAnimal_151_9,
  @idAnimal_214_0,
  @idHato_H1, 2, NULL),
('305/5', 'PO-C1-04', '2025-05-30', '305/5 - Ternero', @idRaza_Simmental, @idColor_Cafe, 'Macho', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-05-30', @idCicloVital_Ternero,
  @idAnimal_251_9,
  @idAnimal_265_0,
  @idHato_H1, 2, NULL),

/* H2: Con padre (toro inactivo) y madre (vaca) */
('153/5', 'PO-C2-01', '2025-03-15', '153/5 - Ternero', @idRaza_Angus, @idColor_Negro, 'Hembra', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-03-15', @idCicloVital_Ternero,
  @idAnimal_272_9,
  @idAnimal_123_0,
  @idHato_H2, 2, NULL),
('64/5', 'PO-C2-02', '2025-04-06', '64/5 - Ternero', @idRaza_Gyr, @idColor_Rojo, 'Macho', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-04-06', @idCicloVital_Ternero,
  @idAnimal_172_9,
  @idAnimal_174_0,
  @idHato_H2, 2, NULL),
('265/5', 'PO-C2-03', '2025-05-26', '265/5 - Ternero', @idRaza_Nelore, @idColor_Blanco, 'Hembra', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-05-26', @idCicloVital_Ternero,
  @idAnimal_272_9,
  @idAnimal_225_0,
  @idHato_H2, 2, NULL),
('176/5', 'PO-C2-04', '2025-06-17', '176/5 - Ternero', @idRaza_Simmental, @idColor_Cafe, 'Macho', 'SEED_PORVENIR_TERNERO', @idEstadoAnimal_Activo, '2025-06-17', @idCicloVital_Ternero,
  @idAnimal_172_9,
  @idAnimal_276_0,
  @idHato_H2, 2, NULL);

SET @idAnimal_122_5 = (SELECT idAnimal FROM animal WHERE codigo = '122/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_213_5 = (SELECT idAnimal FROM animal WHERE codigo = '213/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_94_5  = (SELECT idAnimal FROM animal WHERE codigo = '94/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_305_5 = (SELECT idAnimal FROM animal WHERE codigo = '305/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_153_5 = (SELECT idAnimal FROM animal WHERE codigo = '153/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_64_5  = (SELECT idAnimal FROM animal WHERE codigo = '64/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_265_5 = (SELECT idAnimal FROM animal WHERE codigo = '265/5' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_176_5 = (SELECT idAnimal FROM animal WHERE codigo = '176/5' ORDER BY idAnimal DESC LIMIT 1);

/* PARTOS DE LOS TERNEROS ACTUALES */
INSERT INTO parto (idAnimalMadre, idAnimalPadre, idAnimalCria, idEstadoParto, fecha, peso)
VALUES
  (@idAnimal_112_0, @idAnimal_251_9, @idAnimal_122_5, @idEstadoParto_Actual, '2025-02-12', 31.80),
  (@idAnimal_163_0, @idAnimal_151_9, @idAnimal_213_5, @idEstadoParto_Actual, '2025-03-21', 33.20),
  (@idAnimal_214_0, @idAnimal_151_9, @idAnimal_94_5,  @idEstadoParto_Actual, '2025-04-09', 30.60),
  (@idAnimal_265_0, @idAnimal_251_9, @idAnimal_305_5, @idEstadoParto_Actual, '2025-05-30', 34.40),
  (@idAnimal_123_0, @idAnimal_272_9, @idAnimal_153_5, @idEstadoParto_Actual, '2025-03-15', 31.30),
  (@idAnimal_174_0, @idAnimal_172_9, @idAnimal_64_5,  @idEstadoParto_Actual, '2025-04-06', 32.90),
  (@idAnimal_225_0, @idAnimal_272_9, @idAnimal_265_5, @idEstadoParto_Actual, '2025-05-26', 30.90),
  (@idAnimal_276_0, @idAnimal_172_9, @idAnimal_176_5, @idEstadoParto_Actual, '2025-06-17', 35.10);

/* ARETES: uno unico por animal con formato 00 119 2650 */
SET @areteInicio = 2650;
SET @rowNum = 0;

DROP TEMPORARY TABLE IF EXISTS tmp_arete_por_animal;
CREATE TEMPORARY TABLE tmp_arete_por_animal (
  idAnimal INT NOT NULL,
  numeroArete VARCHAR(20) NOT NULL,
  PRIMARY KEY (idAnimal),
  UNIQUE KEY uk_tmp_numeroArete (numeroArete)
);

INSERT INTO tmp_arete_por_animal (idAnimal, numeroArete)
SELECT
  a.idAnimal,
  CONCAT('00 119 ', LPAD(@areteInicio + (@rowNum := @rowNum + 1) - 1, 4, '0'))
FROM animal a
ORDER BY a.idAnimal;

INSERT INTO arete (nombre, descripcion)
SELECT
  t.numeroArete,
  'SEED_PORVENIR_ARETE'
FROM tmp_arete_por_animal t
ORDER BY t.idAnimal;

UPDATE animal a
INNER JOIN tmp_arete_por_animal t ON t.idAnimal = a.idAnimal
INNER JOIN arete ar ON ar.nombre = t.numeroArete
SET a.idArete = ar.idArete;

DROP TEMPORARY TABLE IF EXISTS tmp_arete_por_animal;

/* COMPRA/VENTA GANADO:
   - Todo animal en estado de venta debe tener su registro de venta.
   - Se registra adicionalmente la compra de un toro activo. */
INSERT INTO cliente (codigo, nombre, descripcion, correo)
SELECT 'CLI-SEED-PORV', 'Cliente Seed Porvenir', 'Cliente para registrar ventas de seed', 'cliente.seed@porvenir.test'
WHERE NOT EXISTS (
  SELECT 1 FROM cliente WHERE codigo = 'CLI-SEED-PORV'
);

INSERT INTO proveedor (codigo, nombre, descripcion, correo)
SELECT 'PROV-SEED-PORV', 'Proveedor Seed Porvenir', 'Proveedor para registrar compras de seed', 'proveedor.seed@porvenir.test'
WHERE NOT EXISTS (
  SELECT 1 FROM proveedor WHERE codigo = 'PROV-SEED-PORV'
);

SET @idClienteSeedPorv = (SELECT idCliente FROM cliente WHERE codigo = 'CLI-SEED-PORV' ORDER BY idCliente DESC LIMIT 1);
SET @idProveedorSeedPorv = (SELECT idProveedor FROM proveedor WHERE codigo = 'PROV-SEED-PORV' ORDER BY idProveedor DESC LIMIT 1);

SET @idAnimal_PA_H1_01 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T1-01' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H1_02 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T1-02' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H2_01 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T2-01' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H2_02 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T2-02' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H3_01 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T3-01' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H3_02 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T3-02' ORDER BY idAnimal DESC LIMIT 1);
SET @idAnimal_PA_H3_03 = (SELECT idAnimal FROM animal WHERE codigoAlterno = 'PA-T3-03' ORDER BY idAnimal DESC LIMIT 1);

INSERT INTO compra_venta_ganado (idProveedor, idCliente, idAnimal, fechaVenta, fechaCompra, precio, precioTransporte)
SELECT
  @idProveedorSeedPorv,
  NULL,
  a.idAnimal,
  NULL,
  DATE_SUB(CURDATE(), INTERVAL 15 DAY),
  2100.00,
  90.00
FROM animal a
WHERE a.idHato = @idHato_PA_H1
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

INSERT INTO compra_venta_ganado (idProveedor, idCliente, idAnimal, fechaVenta, fechaCompra, precio, precioTransporte)
SELECT
  @idProveedorSeedPorv,
  NULL,
  a.idAnimal,
  NULL,
  DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
  2200.00,
  95.00
FROM animal a
WHERE a.idHato = @idHato_PA_H2
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

INSERT INTO compra_venta_ganado (idProveedor, idCliente, idAnimal, fechaVenta, fechaCompra, precio, precioTransporte)
SELECT
  @idProveedorSeedPorv,
  NULL,
  a.idAnimal,
  NULL,
  DATE_SUB(CURDATE(), INTERVAL 2 MONTH),
  2300.00,
  100.00
FROM animal a
WHERE a.idHato = @idHato_PA_H3
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

/* TOROS YA VENDIDOS */
UPDATE animal
SET idEstadoAnimal = @idEstadoAnimal_Venta,
    fechaInactivo = DATE_SUB(CURDATE(), INTERVAL 7 DAY)
WHERE idAnimal IN (@idAnimal_PA_H1_01, @idAnimal_PA_H2_01, @idAnimal_PA_H3_01);

INSERT INTO compra_venta_ganado (idProveedor, idCliente, idAnimal, fechaVenta, fechaCompra, precio, precioTransporte)
VALUES
  (NULL, @idClienteSeedPorv, @idAnimal_251_9, '2024-12-01', NULL, 1500.00, 120.00),
  (NULL, @idClienteSeedPorv, @idAnimal_272_9, '2024-11-15', NULL, 1625.00, 130.00),
  (NULL, @idClienteSeedPorv, @idAnimal_293_9, '2024-10-30', NULL, 1580.00, 110.00),
  (NULL, @idClienteSeedPorv, @idAnimal_PA_H1_01, DATE_SUB(CURDATE(), INTERVAL 7 DAY), NULL, 2450.00, 110.00),
  (NULL, @idClienteSeedPorv, @idAnimal_PA_H2_01, DATE_SUB(CURDATE(), INTERVAL 7 DAY), NULL, 2475.00, 112.00),
  (NULL, @idClienteSeedPorv, @idAnimal_PA_H3_01, DATE_SUB(CURDATE(), INTERVAL 7 DAY), NULL, 2500.00, 115.00),
  (@idProveedorSeedPorv, NULL, @idAnimal_214_9, NULL, '2020-01-13', 1400.00, 95.00);

/* PESAJE 1: cada toro de Parcela con una linea base (450-480 KG aprox) */
INSERT INTO pesaje (idHato, idAnimal, fecha, pesoKg, observacion)
SELECT
  a.idHato,
  a.idAnimal,
  CASE
    WHEN a.idHato = @idHato_PA_H1 THEN DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    WHEN a.idHato = @idHato_PA_H2 THEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    ELSE DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
  END AS fecha,
  CAST(450 + MOD(a.idAnimal * 7, 30) + (MOD(a.idAnimal * 13, 10) / 10) AS DECIMAL(10,2)) AS pesoKg,
  CONCAT('Pesaje inicial de toro Parcela ', a.codigoAlterno) AS observacion
FROM animal a
WHERE a.idHato IN (@idHato_PA_H1, @idHato_PA_H2, @idHato_PA_H3)
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

/* PESAJE 2: seguimiento para H2 y H3 con mayor peso (tendencia de aumento) */
INSERT INTO pesaje (idHato, idAnimal, fecha, pesoKg, observacion)
SELECT
  a.idHato,
  a.idAnimal,
  CASE
    WHEN a.idHato = @idHato_PA_H2 THEN DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    ELSE DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
  END AS fecha,
  CAST(
    (SELECT p1.pesoKg
     FROM pesaje p1
     WHERE p1.idAnimal = a.idAnimal
     ORDER BY p1.fecha DESC
     LIMIT 1)
    + 28 + MOD(a.idAnimal * 5, 22) + (MOD(a.idAnimal * 11, 10) / 10)
    AS DECIMAL(10,2)
  ) AS pesoKg,
  CONCAT('Pesaje de seguimiento (meta 4.5 meses) ', a.codigoAlterno) AS observacion
FROM animal a
WHERE a.idHato IN (@idHato_PA_H2, @idHato_PA_H3)
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

/* PESAJE 3: pre-venta solo para H3 (580-630 KG aprox) */
INSERT INTO pesaje (idHato, idAnimal, fecha, pesoKg, observacion)
SELECT
  a.idHato,
  a.idAnimal,
  DATE_SUB(CURDATE(), INTERVAL 7 DAY) AS fecha,
  CAST(
    (SELECT p2.pesoKg
     FROM pesaje p2
     WHERE p2.idAnimal = a.idAnimal
     ORDER BY p2.fecha DESC
     LIMIT 1)
    + 25 + MOD(a.idAnimal * 9, 35) + (MOD(a.idAnimal * 17, 10) / 10)
    AS DECIMAL(10,2)
  ) AS pesoKg,
  CONCAT('Pesaje pre-venta de toro Parcela ', a.codigoAlterno) AS observacion
FROM animal a
WHERE a.idHato = @idHato_PA_H3
  AND a.sexo = 'Macho'
  AND a.descripcion = 'SEED_PARCELA_TORO';

/* ENFERMEDADES PARA ALGUNOS ANIMALES DE PORVENIR */
/* Crear paquete de control sanitario si no existe */
INSERT INTO paquete (codigo, nombre, descripcion)
SELECT 'CTRL-SAN-PORVENIR', 'Control Sanitario Porvenir', 'Paquete de control sanitario para animales Porvenir'
WHERE NOT EXISTS (
  SELECT 1 FROM paquete WHERE codigo = 'CTRL-SAN-PORVENIR'
);

SET @idPaquete_ControlPorvenir = (
  SELECT idPaquete FROM paquete WHERE codigo = 'CTRL-SAN-PORVENIR' LIMIT 1
);

SET @idEnfermedad_BRU = (SELECT idEnfermedad FROM enfermedad WHERE codigo = 'BRU' LIMIT 1);
SET @idEnfermedad_BVD = (SELECT idEnfermedad FROM enfermedad WHERE codigo = 'BVD' LIMIT 1);
SET @idEnfermedad_MST = (SELECT idEnfermedad FROM enfermedad WHERE codigo = 'MST' LIMIT 1);
SET @idEnfermedad_LEP = (SELECT idEnfermedad FROM enfermedad WHERE codigo = 'LEP' LIMIT 1);
SET @idEnfermedad_IBR = (SELECT idEnfermedad FROM enfermedad WHERE codigo = 'IBR' LIMIT 1);

/* REGISTRAR SINTOMAS: TOROS PRINCIPALES TIENEN BRUCELOSIS */
INSERT IGNORE INTO sintomas_bovinos (idAnimal, idEnfermedad, idPaquete)
SELECT a.idAnimal, @idEnfermedad_BRU, @idPaquete_ControlPorvenir
FROM animal a
WHERE a.codigo IN ('151/9', '172/9', '193/9', '214/9')
  AND a.descripcion = 'SEED_PORVENIR_TORO';

/* REGISTRAR SINTOMAS: ALGUNAS VACAS H1 TIENEN MASTITIS */
INSERT IGNORE INTO sintomas_bovinos (idAnimal, idEnfermedad, idPaquete)
SELECT a.idAnimal, @idEnfermedad_MST, @idPaquete_ControlPorvenir
FROM animal a
WHERE a.idHato = @idHato_H1
  AND a.sexo = 'Hembra'
  AND a.descripcion = 'SEED_PORVENIR_VACA'
  AND a.codigoAlterno IN ('PO-V1-01', 'PO-V1-03', 'PO-V1-05');

/* REGISTRAR SINTOMAS: ALGUNAS VACAS H2 TIENEN DIARREA VIRAL */
INSERT IGNORE INTO sintomas_bovinos (idAnimal, idEnfermedad, idPaquete)
SELECT a.idAnimal, @idEnfermedad_BVD, @idPaquete_ControlPorvenir
FROM animal a
WHERE a.idHato = @idHato_H2
  AND a.sexo = 'Hembra'
  AND a.descripcion = 'SEED_PORVENIR_VACA'
  AND a.codigoAlterno IN ('PO-V2-02', 'PO-V2-04', 'PO-V2-06');

/* REGISTRAR SINTOMAS: ALGUNAS VACAS H3 TIENEN LEPTOSPIROSIS */
INSERT IGNORE INTO sintomas_bovinos (idAnimal, idEnfermedad, idPaquete)
SELECT a.idAnimal, @idEnfermedad_LEP, @idPaquete_ControlPorvenir
FROM animal a
WHERE a.idHato = @idHato_H3
  AND a.sexo = 'Hembra'
  AND a.descripcion = 'SEED_PORVENIR_VACA'
  AND a.codigoAlterno IN ('PO-V3-01', 'PO-V3-03', 'PO-V3-05');

/* REGISTRAR SINTOMAS: ALGUNAS VACAS H4 TIENEN RINOTRAQUEITIS */
INSERT IGNORE INTO sintomas_bovinos (idAnimal, idEnfermedad, idPaquete)
SELECT a.idAnimal, @idEnfermedad_IBR, @idPaquete_ControlPorvenir
FROM animal a
WHERE a.idHato = @idHato_H4
  AND a.sexo = 'Hembra'
  AND a.descripcion = 'SEED_PORVENIR_VACA'
  AND a.codigoAlterno IN ('PO-V4-01', 'PO-V4-03', 'PO-V4-05');

/* ESCENARIOS ADICIONALES DE NOTIFICACIONES */
INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00130', 'SC-NM-01', DATE_SUB(CURDATE(), INTERVAL 130 DAY), 'NSC00130 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NM'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00130');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00131', 'SC-NM-02', DATE_SUB(CURDATE(), INTERVAL 130 DAY), 'NSC00131 - SIN_CICLO_VITAL', 'Macho', 'SEED_NOTIF_ESCENARIO_NM'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00131');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00195', 'SC-ND-01', DATE_SUB(CURDATE(), INTERVAL 195 DAY), 'NSC00195 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_ND'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00195');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00196', 'SC-ND-02', DATE_SUB(CURDATE(), INTERVAL 195 DAY), 'NSC00196 - SIN_CICLO_VITAL', 'Macho', 'SEED_NOTIF_ESCENARIO_ND'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00196');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00570', 'SC-NGH-INI', DATE_SUB(CURDATE(), INTERVAL 570 DAY), 'NSC00570 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NGH'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00570');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00670', 'SC-NGH-MID', DATE_SUB(CURDATE(), INTERVAL 670 DAY), 'NSC00670 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NGH'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00670');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00780', 'SC-NGH-FIN', DATE_SUB(CURDATE(), INTERVAL 780 DAY), 'NSC00780 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NGH'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00780');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00820', 'SC-NGM-MID', DATE_SUB(CURDATE(), INTERVAL 820 DAY), 'NSC00820 - SIN_CICLO_VITAL', 'Macho', 'SEED_NOTIF_ESCENARIO_NGM'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00820');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00900', 'SC-NGM-FIN', DATE_SUB(CURDATE(), INTERVAL 900 DAY), 'NSC00900 - SIN_CICLO_VITAL', 'Macho', 'SEED_NOTIF_ESCENARIO_NGM'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00900');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00105', 'SC-NPC-INI', DATE_SUB(CURDATE(), INTERVAL 105 DAY), 'NSC00105 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NPC'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00105');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00112', 'SC-NPC-MID', DATE_SUB(CURDATE(), INTERVAL 112 DAY), 'NSC00112 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NPC'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00112');

INSERT INTO animal (codigo, codigoAlterno, fechaNacimiento, nombre, sexo, descripcion)
SELECT 'NSC00120', 'SC-NPC-FIN', DATE_SUB(CURDATE(), INTERVAL 120 DAY), 'NSC00120 - SIN_CICLO_VITAL', 'Hembra', 'SEED_NOTIF_ESCENARIO_NPC'
WHERE NOT EXISTS (SELECT 1 FROM animal WHERE codigo = 'NSC00120');

/*
  Recalcular ciclo vital segun edad (meses) y sexo.
  Esto corrige cualquier idCicloVital fijo/inconsistente con fechaNacimiento.
*/
UPDATE animal a
INNER JOIN (
  SELECT
    a2.idAnimal,
    (
      SELECT cv.idCicloVital
      FROM ciclovital cv
      WHERE (cv.mesDesde IS NULL OR cv.mesDesde <= TIMESTAMPDIFF(MONTH, a2.fechaNacimiento, CURDATE()))
        AND (cv.mesHasta IS NULL OR cv.mesHasta >= TIMESTAMPDIFF(MONTH, a2.fechaNacimiento, CURDATE()))
      ORDER BY
        CASE
          WHEN TRIM(UPPER(IFNULL(a2.sexo, ''))) IN ('MACHO', 'M')
               AND (
                 UPPER(IFNULL(cv.nombre, '')) LIKE '%TORO%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%NOVILL%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%TERNER%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%MACH%'
               ) THEN 0
          WHEN TRIM(UPPER(IFNULL(a2.sexo, ''))) IN ('HEMBRA', 'H', 'F')
               AND (
                 UPPER(IFNULL(cv.nombre, '')) LIKE '%VACA%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%NOVILL%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%TERNER%'
                 OR UPPER(IFNULL(cv.nombre, '')) LIKE '%HEMBR%'
               ) THEN 0
          WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%TERNER%'
               OR UPPER(IFNULL(cv.nombre, '')) LIKE '%NOVILL%'
               OR UPPER(IFNULL(cv.nombre, '')) LIKE '%TORO%'
               OR UPPER(IFNULL(cv.nombre, '')) LIKE '%VACA%' THEN 1
          ELSE 2
        END,
        COALESCE(cv.mesDesde, 0) DESC,
        cv.idCicloVital
      LIMIT 1
    ) AS idCicloVitalCalculado
  FROM animal a2
  WHERE a2.fechaNacimiento IS NOT NULL
    AND a2.descripcion LIKE 'SEED_%'
) calc
  ON calc.idAnimal = a.idAnimal
SET a.idCicloVital = calc.idCicloVitalCalculado
WHERE calc.idCicloVitalCalculado IS NOT NULL
  AND a.idAnimal = calc.idAnimal
  AND a.idAnimal > 0;

/*
  Normalizar nombre y descripcion segun ciclo vital ACTUAL.
  Esto evita inconsistencias (ejemplo: 94/5 pasa de Ternero a Novillo(a)).
*/
UPDATE animal a
LEFT JOIN ciclovital cv ON cv.idCicloVital = a.idCicloVital
SET
  a.nombre = CONCAT(a.codigo, ' - ', IFNULL(cv.nombre, 'SIN_CICLO_VITAL')),
  a.descripcion = CASE
    WHEN a.descripcion LIKE 'SEED_PORVENIR_%' THEN
      CASE
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%NOVILL%'
             AND TRIM(UPPER(IFNULL(a.sexo, ''))) IN ('HEMBRA', 'H', 'F') THEN 'SEED_PORVENIR_NOVILLO_A'
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%NOVILL%'
             AND TRIM(UPPER(IFNULL(a.sexo, ''))) IN ('MACHO', 'M') THEN 'SEED_PORVENIR_NOVILLO'
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%TERNER%'
             AND TRIM(UPPER(IFNULL(a.sexo, ''))) IN ('HEMBRA', 'H', 'F') THEN 'SEED_PORVENIR_TERNERO_A'
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%TERNER%'
             AND TRIM(UPPER(IFNULL(a.sexo, ''))) IN ('MACHO', 'M') THEN 'SEED_PORVENIR_TERNERO'
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%VACA%' THEN 'SEED_PORVENIR_VACA'
        WHEN UPPER(IFNULL(cv.nombre, '')) LIKE '%TORO%' THEN 'SEED_PORVENIR_TORO'
        ELSE a.descripcion
      END
    ELSE a.descripcion
  END
WHERE a.codigo IS NOT NULL
  AND a.idAnimal > 0
  AND a.descripcion LIKE 'SEED_%';

COMMIT;


