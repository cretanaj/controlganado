CREATE TABLE `animal` (
  `idAnimal` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) DEFAULT NULL,
  `codigoAlterno` varchar(10) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `idRaza` int DEFAULT NULL,
  `idColor` int DEFAULT NULL,
  `sexo` varchar(6) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `idEstadoAnimal` int DEFAULT NULL,
  `fechaActivo` date DEFAULT NULL,
  `fechaInactivo` date DEFAULT NULL,
  `idCicloVital` int DEFAULT NULL,
  `idAnimalPadre` int DEFAULT NULL,
  `idAnimalMadre` int DEFAULT NULL,
  `idHato` int DEFAULT NULL,
  `idFinca` int DEFAULT NULL,
  `idArete` int DEFAULT NULL,
  PRIMARY KEY (`idAnimal`),
  KEY `idRaza_idx` (`idRaza`),
  KEY `idColor_idx` (`idColor`),
  KEY `idEstadoAnimal_idx` (`idEstadoAnimal`),
  KEY `idArete_idx` (`idArete`),
  CONSTRAINT `idColor` FOREIGN KEY (`idColor`) REFERENCES `color` (`idcolor`),
  CONSTRAINT `idRaza` FOREIGN KEY (`idRaza`) REFERENCES `raza` (`idraza`),
  CONSTRAINT `idArete` FOREIGN KEY (`idArete`) REFERENCES `arete` (`idArete`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ganadodb`.`veterinario` (
  `idVeterinario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `cedula` varchar(50) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idVeterinario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `ganadodb`.`veterinario`
ADD COLUMN `cedula` varchar(50) DEFAULT NULL AFTER `nombre`,
ADD COLUMN `codigo` varchar(50) DEFAULT NULL AFTER `cedula`;

CREATE TABLE IF NOT EXISTS `ganadodb`.`colaborador` (
  `idColaborador` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `cedula` varchar(50) DEFAULT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `oficio` varchar(150) DEFAULT NULL,
  `idFinca` int DEFAULT NULL,
  PRIMARY KEY (`idColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colIdFincaColaboradorExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'colaborador'
    AND COLUMN_NAME = 'idFinca'
);
SET @sqlAddColIdFincaColaborador := IF(
  @colIdFincaColaboradorExists = 0,
  'ALTER TABLE `ganadodb`.`colaborador` ADD COLUMN `idFinca` int DEFAULT NULL AFTER `oficio`',
  'SELECT 1'
);
PREPARE stmtAddColIdFincaColaborador FROM @sqlAddColIdFincaColaborador;
EXECUTE stmtAddColIdFincaColaborador;
DEALLOCATE PREPARE stmtAddColIdFincaColaborador;

SET @idxIdFincaColaboradorExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'colaborador'
    AND INDEX_NAME = 'idx_colaborador_idFinca'
);
SET @sqlAddIdxIdFincaColaborador := IF(
  @idxIdFincaColaboradorExists = 0,
  'ALTER TABLE `ganadodb`.`colaborador` ADD KEY `idx_colaborador_idFinca` (`idFinca`)',
  'SELECT 1'
);
PREPARE stmtAddIdxIdFincaColaborador FROM @sqlAddIdxIdFincaColaborador;
EXECUTE stmtAddIdxIdFincaColaborador;
DEALLOCATE PREPARE stmtAddIdxIdFincaColaborador;

SET @fkIdFincaColaboradorExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = 'ganadodb'
    AND CONSTRAINT_NAME = 'fk_colaborador_finca'
);
SET @sqlAddFkIdFincaColaborador := IF(
  @fkIdFincaColaboradorExists = 0,
  'ALTER TABLE `ganadodb`.`colaborador` ADD CONSTRAINT `fk_colaborador_finca` FOREIGN KEY (`idFinca`) REFERENCES `ganadodb`.`finca` (`idFinca`)',
  'SELECT 1'
);
PREPARE stmtAddFkIdFincaColaborador FROM @sqlAddFkIdFincaColaborador;
EXECUTE stmtAddFkIdFincaColaborador;
DEALLOCATE PREPARE stmtAddFkIdFincaColaborador;

CREATE TABLE IF NOT EXISTS `ganadodb`.`proveedor` (
  `idProveedor` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono1` varchar(20) DEFAULT NULL,
  `contacto1` varchar(150) DEFAULT NULL,
  `telefono2` varchar(20) DEFAULT NULL,
  `contacto2` varchar(150) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idProveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`cliente` (
  `idCliente` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono1` varchar(20) DEFAULT NULL,
  `contacto1` varchar(150) DEFAULT NULL,
  `telefono2` varchar(20) DEFAULT NULL,
  `contacto2` varchar(150) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`compra_venta_ganado` (
  `idCompraVentaGanado` int NOT NULL AUTO_INCREMENT,
  `idProveedor` int DEFAULT NULL,
  `idCliente` int DEFAULT NULL,
  `idAnimal` int NOT NULL,
  `fechaVenta` date DEFAULT NULL,
  `fechaCompra` date DEFAULT NULL,
  `precio` decimal(12,2) DEFAULT NULL,
  `precioTransporte` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`idCompraVentaGanado`),
  KEY `idx_compra_venta_ganado_idProveedor` (`idProveedor`),
  KEY `idx_compra_venta_ganado_idCliente` (`idCliente`),
  KEY `idx_compra_venta_ganado_idAnimal` (`idAnimal`),
  CONSTRAINT `fk_compra_venta_ganado_proveedor` FOREIGN KEY (`idProveedor`) REFERENCES `ganadodb`.`proveedor` (`idProveedor`),
  CONSTRAINT `fk_compra_venta_ganado_cliente` FOREIGN KEY (`idCliente`) REFERENCES `ganadodb`.`cliente` (`idCliente`),
  CONSTRAINT `fk_compra_venta_ganado_animal` FOREIGN KEY (`idAnimal`) REFERENCES `ganadodb`.`animal` (`idAnimal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`producto` (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `fechaCompra` date DEFAULT NULL,
  `fechaFabricacion` date DEFAULT NULL,
  `fechaCaducidad` date DEFAULT NULL,
  `cantidad` decimal(12,2) DEFAULT NULL,
  `lote` varchar(50) DEFAULT NULL,
  `idProveedor` int DEFAULT NULL,
  `numeroFactura` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idProducto`),
  UNIQUE KEY `uk_producto_codigo` (`codigo`),
  KEY `idx_producto_idProveedor` (`idProveedor`),
  CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`idProveedor`) REFERENCES `ganadodb`.`proveedor` (`idProveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colIdProveedorProductoExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'producto'
    AND COLUMN_NAME = 'idProveedor'
);
SET @sqlAddColIdProveedorProducto := IF(
  @colIdProveedorProductoExists = 0,
  'ALTER TABLE `ganadodb`.`producto` ADD COLUMN `idProveedor` int DEFAULT NULL AFTER `lote`',
  'SELECT 1'
);
PREPARE stmtAddColIdProveedorProducto FROM @sqlAddColIdProveedorProducto;
EXECUTE stmtAddColIdProveedorProducto;
DEALLOCATE PREPARE stmtAddColIdProveedorProducto;

SET @idxIdProveedorProductoExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'producto'
    AND INDEX_NAME = 'idx_producto_idProveedor'
);
SET @sqlAddIdxIdProveedorProducto := IF(
  @idxIdProveedorProductoExists = 0,
  'ALTER TABLE `ganadodb`.`producto` ADD KEY `idx_producto_idProveedor` (`idProveedor`)',
  'SELECT 1'
);
PREPARE stmtAddIdxIdProveedorProducto FROM @sqlAddIdxIdProveedorProducto;
EXECUTE stmtAddIdxIdProveedorProducto;
DEALLOCATE PREPARE stmtAddIdxIdProveedorProducto;

SET @ukProductoCodigoExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'producto'
    AND INDEX_NAME = 'uk_producto_codigo'
);
SET @duplicateProductoCodigoCount := (
  SELECT COUNT(*)
  FROM (
    SELECT codigo
    FROM `ganadodb`.`producto`
    WHERE codigo IS NOT NULL
      AND codigo <> ''
    GROUP BY codigo
    HAVING COUNT(*) > 1
  ) duplicados
);
SET @sqlAddUkProductoCodigo := IF(
  @ukProductoCodigoExists = 0 AND @duplicateProductoCodigoCount = 0,
  'ALTER TABLE `ganadodb`.`producto` ADD CONSTRAINT `uk_producto_codigo` UNIQUE (`codigo`)',
  'SELECT 1'
);
PREPARE stmtAddUkProductoCodigo FROM @sqlAddUkProductoCodigo;
EXECUTE stmtAddUkProductoCodigo;
DEALLOCATE PREPARE stmtAddUkProductoCodigo;

SET @fkIdProveedorProductoExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = 'ganadodb'
    AND CONSTRAINT_NAME = 'fk_producto_proveedor'
);
SET @sqlAddFkIdProveedorProducto := IF(
  @fkIdProveedorProductoExists = 0,
  'ALTER TABLE `ganadodb`.`producto` ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`idProveedor`) REFERENCES `ganadodb`.`proveedor` (`idProveedor`)',
  'SELECT 1'
);
PREPARE stmtAddFkIdProveedorProducto FROM @sqlAddFkIdProveedorProducto;
EXECUTE stmtAddFkIdProveedorProducto;
DEALLOCATE PREPARE stmtAddFkIdProveedorProducto;

CREATE TABLE IF NOT EXISTS `ganadodb`.`paquete` (
  `idPaquete` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPaquete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`actividad` (
  `idActividad` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  PRIMARY KEY (`idActividad`),
  UNIQUE KEY `uk_actividad_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ganadodb`.`actividad` (`codigo`, `nombre`) VALUES
  ('ACT001', 'Aplicacion de topico'),
  ('ACT002', 'Aparto de ganado'),
  ('ACT003', 'Asistencia de partos'),
  ('ACT004', 'Asistencia en chapulin'),
  ('ACT005', 'Asistencia en dragas'),
  ('ACT006', 'Alimentacion de ganado'),
  ('ACT007', 'Conduccion de chapulin'),
  ('ACT008', 'Control de malezas'),
  ('ACT009', 'Control de plagas'),
  ('ACT010', 'Creacion de cerca'),
  ('ACT011', 'Creacion de comederos'),
  ('ACT012', 'Creacion de corral'),
  ('ACT013', 'Creacion de puentes'),
  ('ACT014', 'Cura de terneros'),
  ('ACT015', 'Desagues'),
  ('ACT016', 'Entierro de animal'),
  ('ACT017', 'Fumigacion'),
  ('ACT018', 'Mameteo'),
  ('ACT019', 'Mantenimiento de cerca'),
  ('ACT020', 'Mantenimiento de montanas'),
  ('ACT021', 'Mantenimiento de pozas o bebederos de agua'),
  ('ACT022', 'Mantenimiento de vehiculo'),
  ('ACT023', 'Ordeno'),
  ('ACT024', 'Podas de cerca'),
  ('ACT025', 'Reparacion de cerca'),
  ('ACT026', 'Reparacion de comederos'),
  ('ACT027', 'Reparacion de corral'),
  ('ACT028', 'Reparacion de pasos'),
  ('ACT029', 'Reparacion de puentes'),
  ('ACT030', 'Reparacion de tuberias'),
  ('ACT031', 'Removimiento de cerca'),
  ('ACT032', 'Siembra de pastos'),
  ('ACT033', 'Vacunacion')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`);

CREATE TABLE IF NOT EXISTS `ganadodb`.`control_actividad` (
  `idActividad` int NOT NULL,
  `idPaquete` int NOT NULL,
  PRIMARY KEY (`idActividad`, `idPaquete`),
  KEY `idx_control_actividad_idPaquete` (`idPaquete`),
  CONSTRAINT `fk_control_actividad_actividad` FOREIGN KEY (`idActividad`) REFERENCES `ganadodb`.`actividad` (`idActividad`),
  CONSTRAINT `fk_control_actividad_paquete` FOREIGN KEY (`idPaquete`) REFERENCES `ganadodb`.`paquete` (`idPaquete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`control_paquete` (
  `idPaquete` int NOT NULL,
  `idProducto` int NOT NULL,
  `dosificacion` varchar(250) DEFAULT NULL,
  `indicaciones` varchar(500) DEFAULT NULL,
  `funcion` varchar(500) DEFAULT NULL,
  `fechaCaducidad` date DEFAULT NULL,
  `imagenes` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPaquete`, `idProducto`),
  KEY `idx_control_paquete_idProducto` (`idProducto`),
  CONSTRAINT `fk_control_paquete_paquete` FOREIGN KEY (`idPaquete`) REFERENCES `ganadodb`.`paquete` (`idPaquete`),
  CONSTRAINT `fk_control_paquete_producto` FOREIGN KEY (`idProducto`) REFERENCES `ganadodb`.`producto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colDosificacionControlPaqueteExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'control_paquete'
    AND COLUMN_NAME = 'dosificacion'
);
SET @sqlAddColDosificacionControlPaquete := IF(
  @colDosificacionControlPaqueteExists = 0,
  'ALTER TABLE `ganadodb`.`control_paquete` ADD COLUMN `dosificacion` varchar(250) DEFAULT NULL AFTER `idProducto`',
  'SELECT 1'
);
PREPARE stmtAddColDosificacionControlPaquete FROM @sqlAddColDosificacionControlPaquete;
EXECUTE stmtAddColDosificacionControlPaquete;
DEALLOCATE PREPARE stmtAddColDosificacionControlPaquete;

SET @colIndicacionesControlPaqueteExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'control_paquete'
    AND COLUMN_NAME = 'indicaciones'
);
SET @sqlAddColIndicacionesControlPaquete := IF(
  @colIndicacionesControlPaqueteExists = 0,
  'ALTER TABLE `ganadodb`.`control_paquete` ADD COLUMN `indicaciones` varchar(500) DEFAULT NULL AFTER `dosificacion`',
  'SELECT 1'
);
PREPARE stmtAddColIndicacionesControlPaquete FROM @sqlAddColIndicacionesControlPaquete;
EXECUTE stmtAddColIndicacionesControlPaquete;
DEALLOCATE PREPARE stmtAddColIndicacionesControlPaquete;

SET @colFuncionControlPaqueteExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'control_paquete'
    AND COLUMN_NAME = 'funcion'
);
SET @sqlAddColFuncionControlPaquete := IF(
  @colFuncionControlPaqueteExists = 0,
  'ALTER TABLE `ganadodb`.`control_paquete` ADD COLUMN `funcion` varchar(500) DEFAULT NULL AFTER `indicaciones`',
  'SELECT 1'
);
PREPARE stmtAddColFuncionControlPaquete FROM @sqlAddColFuncionControlPaquete;
EXECUTE stmtAddColFuncionControlPaquete;
DEALLOCATE PREPARE stmtAddColFuncionControlPaquete;

SET @colFechaCaducidadControlPaqueteExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'control_paquete'
    AND COLUMN_NAME = 'fechaCaducidad'
);
SET @sqlAddColFechaCaducidadControlPaquete := IF(
  @colFechaCaducidadControlPaqueteExists = 0,
  'ALTER TABLE `ganadodb`.`control_paquete` ADD COLUMN `fechaCaducidad` date DEFAULT NULL AFTER `funcion`',
  'SELECT 1'
);
PREPARE stmtAddColFechaCaducidadControlPaquete FROM @sqlAddColFechaCaducidadControlPaquete;
EXECUTE stmtAddColFechaCaducidadControlPaquete;
DEALLOCATE PREPARE stmtAddColFechaCaducidadControlPaquete;

SET @colImagenesControlPaqueteExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'control_paquete'
    AND COLUMN_NAME = 'imagenes'
);
SET @sqlAddColImagenesControlPaquete := IF(
  @colImagenesControlPaqueteExists = 0,
  'ALTER TABLE `ganadodb`.`control_paquete` ADD COLUMN `imagenes` varchar(500) DEFAULT NULL AFTER `fechaCaducidad`',
  'SELECT 1'
);
PREPARE stmtAddColImagenesControlPaquete FROM @sqlAddColImagenesControlPaquete;
EXECUTE stmtAddColImagenesControlPaquete;
DEALLOCATE PREPARE stmtAddColImagenesControlPaquete;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `ganadodb`.`control_paquete`;
TRUNCATE TABLE `ganadodb`.`producto`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `ganadodb`.`producto` (`codigo`, `nombre`) VALUES
  ('DESPO', 'Desparasitante oral - Fembendazol'),
  ('DESPI', 'Desparasitante inyectado'),
  ('DESPT', 'Desparasitante topico'),
  ('VITREP', 'Vitaminas reproductivas'),
  ('ANTIV', 'Antraxx'),
  ('ANTIV', 'Clustry'),
  ('DESPO', 'Desparasitante oral - Abendazol'),
  ('DESPI', 'Desparasitante inyectado'),
  ('DESPT', 'Desparasitante topico'),
  ('VITENG', 'Vitaminas para engorde'),
  ('ANTIV', 'Antraxx'),
  ('ANTIV', 'Triple'),
  ('DESPO', 'Desparasitante oral - Fembendazol'),
  ('DESPI', 'Desparasitante inyectado'),
  ('DESPT', 'Desparasitante topico'),
  ('VITREP', 'Vitaminas reproductivas');

CREATE TABLE `ganadodb`.`palpacion` (
  `idPalpacion` int NOT NULL AUTO_INCREMENT,
  `idAnimalVaca` int NOT NULL,
  `idHato` int DEFAULT NULL,
  `fecha` date NOT NULL,
  `idEstadoPalpacion` int DEFAULT NULL,
  `resultadoPrenez` decimal(4,1) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `idVeterinario` int DEFAULT NULL,
  PRIMARY KEY (`idPalpacion`),
  KEY `idx_palpacion_idAnimalVaca` (`idAnimalVaca`),
  KEY `idx_palpacion_idHato` (`idHato`),
  KEY `idx_palpacion_idEstadoPalpacion` (`idEstadoPalpacion`),
  KEY `idx_palpacion_idVeterinario` (`idVeterinario`),
  CONSTRAINT `fk_palpacion_animal` FOREIGN KEY (`idAnimalVaca`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_palpacion_hato` FOREIGN KEY (`idHato`) REFERENCES `ganadodb`.`hato` (`idHato`),
  CONSTRAINT `fk_palpacion_estado` FOREIGN KEY (`idEstadoPalpacion`) REFERENCES `ganadodb`.`estado_palpacion` (`idEstadoPalpacion`),
  CONSTRAINT `fk_palpacion_veterinario` FOREIGN KEY (`idVeterinario`) REFERENCES `ganadodb`.`veterinario` (`idVeterinario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`estado_animal` (
  `idEstadoAnimal` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idEstadoAnimal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`estado_tarea` (
  `idEstadoTarea` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  PRIMARY KEY (`idEstadoTarea`),
  UNIQUE KEY `uk_estado_tarea_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`enfermedad` (
  `idEnfermedad` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idEnfermedad`),
  UNIQUE KEY `uk_enfermedad_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ganadodb`.`enfermedad` (`codigo`, `nombre`, `descripcion`) VALUES
  ('BRU', 'Brucelosis bovina', 'Enfermedad bacteriana reproductiva que puede causar abortos, infertilidad y retencion placentaria.'),
  ('LEP', 'Leptospirosis bovina', 'Infeccion bacteriana asociada a fiebre, abortos, caida de produccion y problemas reproductivos.'),
  ('IBR', 'Rinotraqueitis infecciosa bovina', 'Enfermedad viral respiratoria y reproductiva causada por herpesvirus bovino tipo 1.'),
  ('BVD', 'Diarrea viral bovina', 'Enfermedad viral que afecta inmunidad, digestivo y reproduccion; puede causar animales persistentemente infectados.'),
  ('FMD', 'Fiebre aftosa', 'Enfermedad viral altamente contagiosa que produce lesiones vesiculares en boca y pezuñas.'),
  ('MST', 'Mastitis bovina', 'Inflamacion de la glandula mamaria por agentes infecciosos o factores de manejo.'),
  ('ANA', 'Anaplasmosis bovina', 'Enfermedad transmitida por garrapatas que causa anemia, fiebre, debilidad y perdida de peso.'),
  ('CARB', 'Carbunco bacteridiano', 'Enfermedad bacteriana aguda de alta gravedad que puede causar muerte subita en bovinos.'),
  ('PARA', 'Paratuberculosis', 'Enfermedad cronica intestinal causada por Mycobacterium avium subsp. paratuberculosis.'),
  ('NEO', 'Neosporosis bovina', 'Enfermedad parasitaria asociada principalmente a abortos y fallas reproductivas en vacas.')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`);

INSERT INTO `ganadodb`.`estado_tarea` (`codigo`, `nombre`) VALUES
  ('NUE', 'Nueva'),
  ('PEN', 'Pendiente'),
  ('COM', 'Completada')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`);

CREATE TABLE IF NOT EXISTS `ganadodb`.`notificacion` (
  `idNotificacion` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `condicionDias` int DEFAULT NULL,
  `fechaInicioDias` int DEFAULT NULL,
  `fechaFinalDias` int DEFAULT NULL,
  `criterio` varchar(250) DEFAULT NULL,
  `instrucciones` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`idNotificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`tipo_notificacion` (
  `idTipoNotificacion` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `notificacionClass` varchar(150) NOT NULL,
  PRIMARY KEY (`idTipoNotificacion`),
  UNIQUE KEY `uk_tipo_notificacion_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ganadodb`.`tipo_notificacion` (`codigo`, `notificacionClass`) VALUES
  ('D', 'ms-1 text-danger fas fa-fw fa-bell'),
  ('W', 'ms-1 text-warning fas fa-fw fa-envelope-open'),
  ('P', 'ms-1 text-primary fas fa-fw fa-building'),
  ('S', 'ms-1 text-success fas fa-fw fa-bell-slash')
ON DUPLICATE KEY UPDATE
  `notificacionClass` = VALUES(`notificacionClass`);

SET @colIdTipoNotificacionExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'notificacion'
    AND COLUMN_NAME = 'idTipoNotificacion'
);
SET @sqlAddColIdTipoNotificacion := IF(
  @colIdTipoNotificacionExists = 0,
  'ALTER TABLE `ganadodb`.`notificacion` ADD COLUMN `idTipoNotificacion` int DEFAULT NULL AFTER `nombre`',
  'SELECT 1'
);
PREPARE stmtAddColIdTipoNotificacion FROM @sqlAddColIdTipoNotificacion;
EXECUTE stmtAddColIdTipoNotificacion;
DEALLOCATE PREPARE stmtAddColIdTipoNotificacion;

SET @idxIdTipoNotificacionExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'notificacion'
    AND INDEX_NAME = 'idx_notificacion_idTipoNotificacion'
);
SET @sqlAddIdxIdTipoNotificacion := IF(
  @idxIdTipoNotificacionExists = 0,
  'ALTER TABLE `ganadodb`.`notificacion` ADD KEY `idx_notificacion_idTipoNotificacion` (`idTipoNotificacion`)',
  'SELECT 1'
);
PREPARE stmtAddIdxIdTipoNotificacion FROM @sqlAddIdxIdTipoNotificacion;
EXECUTE stmtAddIdxIdTipoNotificacion;
DEALLOCATE PREPARE stmtAddIdxIdTipoNotificacion;

SET @fkIdTipoNotificacionExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = 'ganadodb'
    AND CONSTRAINT_NAME = 'fk_notificacion_tipo_notificacion'
);
SET @sqlAddFkIdTipoNotificacion := IF(
  @fkIdTipoNotificacionExists = 0,
  'ALTER TABLE `ganadodb`.`notificacion` ADD CONSTRAINT `fk_notificacion_tipo_notificacion` FOREIGN KEY (`idTipoNotificacion`) REFERENCES `ganadodb`.`tipo_notificacion` (`idTipoNotificacion`)',
  'SELECT 1'
);
PREPARE stmtAddFkIdTipoNotificacion FROM @sqlAddFkIdTipoNotificacion;
EXECUTE stmtAddFkIdTipoNotificacion;
DEALLOCATE PREPARE stmtAddFkIdTipoNotificacion;

INSERT INTO `ganadodb`.`notificacion` (
  `codigo`,
  `nombre`,
  `condicionDias`,
  `fechaInicioDias`,
  `fechaFinalDias`,
  `criterio`
)
VALUES
  ('NM', 'Marca', 130, NULL, NULL, NULL),
  ('ND', 'Destete', 195, NULL, NULL, NULL),
  ('NGH', 'Gestacion Hembra', NULL, 570, 780, NULL),
  ('NGM', 'Gestacion Macho', NULL, 780, 900, NULL),
  ('NPC', 'Palpacion Calendario', NULL, 105, 120, 'debe ser vaca que esta con toro'),
  ('NPP', 'Palpacion Preñez', NULL, NULL, NULL, 'la vaca esta pronto a parir y debe avisar une mes antes a la fecha definida en la ultima palpacion basado en su status , solo si esta preñada');

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'ANM00130', 'ALT00130', DATE_SUB(CURDATE(), INTERVAL 130 DAY), 'Prueba Marca 130 dias', 'Hembra', 'Animal de prueba para notificacion NM'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'ANM00130'
);

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'AND00195', 'ALT00195', DATE_SUB(CURDATE(), INTERVAL 195 DAY), 'Prueba Destete 195 dias', 'Macho', 'Animal de prueba para notificacion ND'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'AND00195'
);

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'AGH00600', 'ALT00600', DATE_SUB(CURDATE(), INTERVAL 600 DAY), 'Prueba Gestacion Hembra', 'Hembra', 'Animal de prueba para notificacion NGH'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'AGH00600'
);

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'AGM00850', 'ALT00850', DATE_SUB(CURDATE(), INTERVAL 850 DAY), 'Prueba Gestacion Macho', 'Macho', 'Animal de prueba para notificacion NGM'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'AGM00850'
);

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'APC00110', 'ALT00110', DATE_SUB(CURDATE(), INTERVAL 110 DAY), 'Prueba Palpacion Calendario', 'Hembra', 'Animal de prueba para notificacion NPC'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'APC00110'
);

INSERT INTO `ganadodb`.`animal` (
  `codigo`,
  `codigoAlterno`,
  `fechaNacimiento`,
  `nombre`,
  `sexo`,
  `descripcion`
)
SELECT 'APP00255', 'ALT00255', DATE_SUB(CURDATE(), INTERVAL 255 DAY), 'Prueba Palpacion Prenez', 'Hembra', 'Animal de prueba para notificacion NPP'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `ganadodb`.`animal` WHERE `codigo` = 'APP00255'
);

CREATE TABLE `ganadodb`.`estado_parto` (
  `idEstadoParto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idEstadoParto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ganadodb`.`parto` (
  `idParto` int NOT NULL AUTO_INCREMENT,
  `idAnimalMadre` int NOT NULL,
  `idAnimalPadre` int NOT NULL,
  `idAnimalCria` int NOT NULL,
  `idEstadoParto` int NOT NULL,
  `fecha` date NOT NULL,
  `peso` decimal(8,2) NOT NULL,
  PRIMARY KEY (`idParto`),
  KEY `idx_parto_idAnimalMadre` (`idAnimalMadre`),
  KEY `idx_parto_idAnimalPadre` (`idAnimalPadre`),
  KEY `idx_parto_idAnimalCria` (`idAnimalCria`),
  KEY `idx_parto_idEstadoParto` (`idEstadoParto`),
  CONSTRAINT `fk_parto_animal_madre` FOREIGN KEY (`idAnimalMadre`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_parto_animal_padre` FOREIGN KEY (`idAnimalPadre`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_parto_animal_cria` FOREIGN KEY (`idAnimalCria`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_parto_estado_parto` FOREIGN KEY (`idEstadoParto`) REFERENCES `ganadodb`.`estado_parto` (`idEstadoParto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'parto'
    AND COLUMN_NAME = 'idEstadoParto'
);
SET @sqlCol := IF(
  @colExists = 0,
  'ALTER TABLE `ganadodb`.`parto` ADD COLUMN `idEstadoParto` int NOT NULL AFTER `idAnimalCria`',
  'SELECT 1'
);
PREPARE stmtCol FROM @sqlCol;
EXECUTE stmtCol;
DEALLOCATE PREPARE stmtCol;

SET @idxExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'parto'
    AND INDEX_NAME = 'idx_parto_idEstadoParto'
);
SET @sqlIdx := IF(
  @idxExists = 0,
  'ALTER TABLE `ganadodb`.`parto` ADD KEY `idx_parto_idEstadoParto` (`idEstadoParto`)',
  'SELECT 1'
);
PREPARE stmtIdx FROM @sqlIdx;
EXECUTE stmtIdx;
DEALLOCATE PREPARE stmtIdx;

SET @fkExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = 'ganadodb'
    AND CONSTRAINT_NAME = 'fk_parto_estado_parto'
);
SET @sqlFk := IF(
  @fkExists = 0,
  'ALTER TABLE `ganadodb`.`parto` ADD CONSTRAINT `fk_parto_estado_parto` FOREIGN KEY (`idEstadoParto`) REFERENCES `ganadodb`.`estado_parto` (`idEstadoParto`)',
  'SELECT 1'
);
PREPARE stmtFk FROM @sqlFk;
EXECUTE stmtFk;
DEALLOCATE PREPARE stmtFk;

CREATE TABLE IF NOT EXISTS `ganadodb`.`perfil` (
  `idPerfil` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPerfil`),
  UNIQUE KEY `uk_perfil_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ganadodb`.`perfil` (`codigo`, `nombre`, `descripcion`) VALUES
  ('ADM', 'Administrador', 'desc'),
  ('REP', 'Representante', 'desc'),
  ('ENC', 'Encargado', 'desc'),
  ('COL', 'Colaborador', 'desc')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`);

CREATE TABLE IF NOT EXISTS `ganadodb`.`asignacion_finca` (
  `idPerfil` int NOT NULL,
  `idFinca` int NOT NULL,
  `fecha` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`idPerfil`, `idFinca`),
  KEY `idx_asignacion_finca_idFinca` (`idFinca`),
  CONSTRAINT `fk_asignacion_finca_perfil` FOREIGN KEY (`idPerfil`) REFERENCES `ganadodb`.`perfil` (`idPerfil`),
  CONSTRAINT `fk_asignacion_finca_finca` FOREIGN KEY (`idFinca`) REFERENCES `ganadodb`.`finca` (`idFinca`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombreUsuario` varchar(100) NOT NULL,
  `nombreCompleto` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `clave` varchar(255) NOT NULL,
  `idPerfil` int DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `uk_usuario_codigo` (`codigo`),
  UNIQUE KEY `uk_usuario_nombreUsuario` (`nombreUsuario`),
  KEY `idx_usuario_idPerfil` (`idPerfil`),
  CONSTRAINT `fk_usuario_perfil` FOREIGN KEY (`idPerfil`) REFERENCES `ganadodb`.`perfil` (`idPerfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- MÓDULO DE SEGURIDAD
-- Tablas: perfil, asignacion_finca, usuario,
--         modulo_seguridad, perfil_modulo_permiso
-- =============================================

CREATE TABLE IF NOT EXISTS `ganadodb`.`modulo_seguridad` (
  `idModulo`    int           NOT NULL AUTO_INCREMENT,
  `nombre`      varchar(150)  NOT NULL,
  `clave`       varchar(50)   NOT NULL,
  `rutaBase`    varchar(200)  DEFAULT NULL,
  `icono`       varchar(100)  DEFAULT NULL,
  `descripcion` varchar(500)  DEFAULT NULL,
  `estado`      tinyint(1)    NOT NULL DEFAULT '1',
  PRIMARY KEY (`idModulo`),
  UNIQUE KEY `uk_modulo_clave` (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ganadodb`.`modulo_seguridad` (`nombre`, `clave`, `rutaBase`, `estado`) VALUES
  ('Actividad',              'ACTIVIDAD',            '/actividad',           1),
  ('Animal',                 'ANIMAL',                '/animal',              1),
  ('Arete',                  'ARETE',                 '/arete',               1),
  ('Asignación de Finca',    'ASIGNACION_FINCA',      '/asignacionfinca',     1),
  ('Celo',                   'CELO',                  '/celo',                1),
  ('Ciclo Vital',            'CICLOVITAL',            '/ciclovital',          1),
  ('Cliente',                'CLIENTE',               '/cliente',             1),
  ('Colaborador',            'COLABORADOR',           '/colaborador',         1),
  ('Color',                  'COLOR',                 '/color',               1),
  ('Compra Venta Ganado',    'COMPRA_VENTA_GANADO',   '/compraventaganado',   1),
  ('Control de Actividad',   'CONTROL_ACTIVIDAD',     '/controlactividad',    1),
  ('Control de Paquete',     'CONTROL_PAQUETE',       '/controlpaquete',      1),
  ('Dashboard',              'DASHBOARD',             '/',                    1),
  ('Enfermedad',             'ENFERMEDAD',            '/enfermedad',          1),
  ('Estado Animal',          'ESTADO_ANIMAL',         '/estadoanimal',        1),
  ('Estado Palpación',       'ESTADO_PALPACION',      '/estadopalpacion',     1),
  ('Estado Parto',           'ESTADO_PARTO',          '/estadoparto',         1),
  ('Estado Tarea',           'ESTADO_TAREA',          '/estadotarea',         1),
  ('Finca',                  'FINCA',                 '/finca',               1),
  ('Google Maps',            'GOOGLEMAPS',            '/googlemaps',          1),
  ('Hato',                   'HATO',                  '/hato',                1),
  ('Inventario',             'INVENTARIO',            '/inventario',          1),
  ('Movimiento de Hato',     'MOVIMIENTO_HATO',       '/movimientohato',      1),
  ('Notificación',           'NOTIFICACION',          '/notificacion',        1),
  ('Notificación Resumen',   'NOTIFICACION_RESUMEN',  '/notificacionresumen', 1),
  ('Palpación',              'PALPACION',             '/palpacion',           1),
  ('Paquete',                'PAQUETE',               '/paquete',             1),
  ('Parto',                  'PARTO',                 '/parto',               1),
  ('Perfil',                 'PERFIL',                '/perfil',              1),
  ('Permiso',                'PERMISO',               '/permiso',             1),
  ('Pesaje',                 'PESAJE',                '/pesaje',              1),
  ('Producto',               'PRODUCTO',              '/producto',            1),
  ('Proveedor',              'PROVEEDOR',             '/proveedor',           1),
  ('Raza',                   'RAZA',                  '/raza',                1),
  ('Síntoma Bovino',         'SINTOMA_BOVINO',        '/sintomabovino',       1),
  ('Tarea',                  'TAREA',                 '/tarea',               1),
  ('Tipo Notificación',      'TIPO_NOTIFICACION',     '/tiponotificacion',    1),
  ('Usuario',                'USUARIO',               '/usuario',             1),
  ('Vacunación',             'VACUNACION',            '/vacunacion',          1),
  ('Veterinario',            'VETERINARIO',           '/veterinario',         1)
ON DUPLICATE KEY UPDATE
  `nombre`   = VALUES(`nombre`),
  `rutaBase` = VALUES(`rutaBase`),
  `estado`   = VALUES(`estado`);

CREATE TABLE IF NOT EXISTS `ganadodb`.`perfil_modulo_permiso` (
  `idPerfil`      int         NOT NULL,
  `idModulo`      int         NOT NULL,
  `puedeVer`      tinyint(1)  NOT NULL DEFAULT '0',
  `puedeCrear`    tinyint(1)  NOT NULL DEFAULT '0',
  `puedeEditar`   tinyint(1)  NOT NULL DEFAULT '0',
  `puedeEliminar` tinyint(1)  NOT NULL DEFAULT '0',
  PRIMARY KEY (`idPerfil`, `idModulo`),
  KEY `idx_pmp_idModulo` (`idModulo`),
  CONSTRAINT `fk_pmp_perfil`  FOREIGN KEY (`idPerfil`) REFERENCES `ganadodb`.`perfil`           (`idPerfil`),
  CONSTRAINT `fk_pmp_modulo`  FOREIGN KEY (`idModulo`) REFERENCES `ganadodb`.`modulo_seguridad` (`idModulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ADM: todos los permisos
INSERT INTO `ganadodb`.`perfil_modulo_permiso` (`idPerfil`, `idModulo`, `puedeVer`, `puedeCrear`, `puedeEditar`, `puedeEliminar`)
SELECT p.`idPerfil`, m.`idModulo`, 1, 1, 1, 1
FROM `ganadodb`.`perfil` p
CROSS JOIN `ganadodb`.`modulo_seguridad` m
WHERE p.`codigo` = 'ADM'
ON DUPLICATE KEY UPDATE
  `puedeVer`      = VALUES(`puedeVer`),
  `puedeCrear`    = VALUES(`puedeCrear`),
  `puedeEditar`   = VALUES(`puedeEditar`),
  `puedeEliminar` = VALUES(`puedeEliminar`);

-- REP, ENC, COL: solo ver
INSERT INTO `ganadodb`.`perfil_modulo_permiso` (`idPerfil`, `idModulo`, `puedeVer`, `puedeCrear`, `puedeEditar`, `puedeEliminar`)
SELECT p.`idPerfil`, m.`idModulo`, 1, 0, 0, 0
FROM `ganadodb`.`perfil` p
CROSS JOIN `ganadodb`.`modulo_seguridad` m
WHERE p.`codigo` IN ('REP', 'ENC', 'COL')
ON DUPLICATE KEY UPDATE
  `puedeVer`      = VALUES(`puedeVer`),
  `puedeCrear`    = VALUES(`puedeCrear`),
  `puedeEditar`   = VALUES(`puedeEditar`),
  `puedeEliminar` = VALUES(`puedeEliminar`);

CREATE TABLE IF NOT EXISTS `ganadodb`.`inventario` (
  `idProducto` int NOT NULL,
  `idFinca` int NOT NULL,
  `idUsuario` int NOT NULL,
  `cantidad` decimal(12,2) DEFAULT NULL,
  `fecha` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`idProducto`, `idFinca`, `idUsuario`, `fecha`),
  KEY `idx_inventario_idFinca` (`idFinca`),
  KEY `idx_inventario_idUsuario` (`idUsuario`),
  CONSTRAINT `fk_inventario_producto` FOREIGN KEY (`idProducto`) REFERENCES `ganadodb`.`producto` (`idProducto`),
  CONSTRAINT `fk_inventario_finca` FOREIGN KEY (`idFinca`) REFERENCES `ganadodb`.`finca` (`idFinca`),
  CONSTRAINT `fk_inventario_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `ganadodb`.`usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colCantidadInventarioExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'inventario'
    AND COLUMN_NAME = 'cantidad'
);
SET @sqlAddColCantidadInventario := IF(
  @colCantidadInventarioExists = 0,
  'ALTER TABLE `ganadodb`.`inventario` ADD COLUMN `cantidad` decimal(12,2) DEFAULT NULL AFTER `idUsuario`',
  'SELECT 1'
);
PREPARE stmtAddColCantidadInventario FROM @sqlAddColCantidadInventario;
EXECUTE stmtAddColCantidadInventario;
DEALLOCATE PREPARE stmtAddColCantidadInventario;

CREATE TABLE IF NOT EXISTS `ganadodb`.`celo` (
  `idCelo` int NOT NULL AUTO_INCREMENT,
  `idAnimalVaca` int NOT NULL,
  `idAnimalToro` int NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date DEFAULT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idCelo`),
  KEY `idx_celo_idAnimalVaca` (`idAnimalVaca`),
  KEY `idx_celo_idAnimalToro` (`idAnimalToro`),
  CONSTRAINT `fk_celo_animal_vaca` FOREIGN KEY (`idAnimalVaca`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_celo_animal_toro` FOREIGN KEY (`idAnimalToro`) REFERENCES `ganadodb`.`animal` (`idAnimal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`sintomas_bovinos` (
  `idAnimal` int NOT NULL,
  `idEnfermedad` int NOT NULL,
  `idPaquete` int NOT NULL,
  PRIMARY KEY (`idAnimal`, `idEnfermedad`, `idPaquete`),
  KEY `idx_sintomas_bovinos_idEnfermedad` (`idEnfermedad`),
  KEY `idx_sintomas_bovinos_idPaquete` (`idPaquete`),
  CONSTRAINT `fk_sintomas_bovinos_animal` FOREIGN KEY (`idAnimal`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_sintomas_bovinos_enfermedad` FOREIGN KEY (`idEnfermedad`) REFERENCES `ganadodb`.`enfermedad` (`idEnfermedad`),
  CONSTRAINT `fk_sintomas_bovinos_paquete` FOREIGN KEY (`idPaquete`) REFERENCES `ganadodb`.`paquete` (`idPaquete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`tarea` (
  `idTarea` int NOT NULL AUTO_INCREMENT,
  `idActividad` int NOT NULL,
  `idUser` int NOT NULL,
  `idEstadoTarea` int NOT NULL,
  `fecha` date NOT NULL,
  `fechaFinalizacion` date DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idTarea`),
  KEY `idx_tarea_idActividad` (`idActividad`),
  KEY `idx_tarea_idUser` (`idUser`),
  KEY `idx_tarea_idEstadoTarea` (`idEstadoTarea`),
  CONSTRAINT `fk_tarea_actividad` FOREIGN KEY (`idActividad`) REFERENCES `ganadodb`.`actividad` (`idActividad`),
  CONSTRAINT `fk_tarea_usuario` FOREIGN KEY (`idUser`) REFERENCES `ganadodb`.`usuario` (`idUsuario`),
  CONSTRAINT `fk_tarea_estado_tarea` FOREIGN KEY (`idEstadoTarea`) REFERENCES `ganadodb`.`estado_tarea` (`idEstadoTarea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET @colFechaFinalizacionTareaExists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'ganadodb'
    AND TABLE_NAME = 'tarea'
    AND COLUMN_NAME = 'fechaFinalizacion'
);
SET @sqlAddColFechaFinalizacionTarea := IF(
  @colFechaFinalizacionTareaExists = 0,
  'ALTER TABLE `ganadodb`.`tarea` ADD COLUMN `fechaFinalizacion` date DEFAULT NULL AFTER `fecha`',
  'SELECT 1'
);
PREPARE stmtAddColFechaFinalizacionTarea FROM @sqlAddColFechaFinalizacionTarea;
EXECUTE stmtAddColFechaFinalizacionTarea;
DEALLOCATE PREPARE stmtAddColFechaFinalizacionTarea;

CREATE TABLE IF NOT EXISTS `ganadodb`.`vacunacion` (
  `idVacunacion` int NOT NULL AUTO_INCREMENT,
  `idHato` int NOT NULL,
  `idAnimal` int NOT NULL,
  `idPaquete` int NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idVacunacion`),
  KEY `idx_vacunacion_idHato` (`idHato`),
  KEY `idx_vacunacion_idAnimal` (`idAnimal`),
  KEY `idx_vacunacion_idPaquete` (`idPaquete`),
  CONSTRAINT `fk_vacunacion_hato` FOREIGN KEY (`idHato`) REFERENCES `ganadodb`.`hato` (`idHato`),
  CONSTRAINT `fk_vacunacion_animal` FOREIGN KEY (`idAnimal`) REFERENCES `ganadodb`.`animal` (`idAnimal`),
  CONSTRAINT `fk_vacunacion_paquete` FOREIGN KEY (`idPaquete`) REFERENCES `ganadodb`.`paquete` (`idPaquete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ganadodb`.`pesaje` (
  `idPesaje` int NOT NULL AUTO_INCREMENT,
  `idHato` int NOT NULL,
  `idAnimal` int NOT NULL,
  `fecha` date NOT NULL,
  `pesoKg` decimal(10,2) NOT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPesaje`),
  KEY `idx_pesaje_idHato` (`idHato`),
  KEY `idx_pesaje_idAnimal` (`idAnimal`),
  KEY `idx_pesaje_fecha` (`fecha`),
  CONSTRAINT `fk_pesaje_hato` FOREIGN KEY (`idHato`) REFERENCES `ganadodb`.`hato` (`idHato`),
  CONSTRAINT `fk_pesaje_animal` FOREIGN KEY (`idAnimal`) REFERENCES `ganadodb`.`animal` (`idAnimal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `ganadodb`.`animal`
  ADD COLUMN `idEstadoAnimal` int DEFAULT NULL AFTER `descripcion`,
  ADD KEY `idEstadoAnimal_idx` (`idEstadoAnimal`),
  ADD CONSTRAINT `fk_animal_estado_animal` FOREIGN KEY (`idEstadoAnimal`) REFERENCES `ganadodb`.`estado_animal` (`idEstadoAnimal`);

DROP PROCEDURE IF EXISTS `ganadodb`.`sp_registrar_parto`;
DELIMITER $$
CREATE PROCEDURE `ganadodb`.`sp_registrar_parto`(
  IN p_idAnimalMadre INT,
  IN p_idAnimalPadre INT,
  IN p_idEstadoParto INT,
  IN p_fecha DATE,
  IN p_peso DECIMAL(8,2),
  IN p_codigo VARCHAR(10),
  IN p_codigoAlterno VARCHAR(10),
  IN p_idRaza INT,
  IN p_idColor INT,
  IN p_sexo VARCHAR(6),
  IN p_descripcion VARCHAR(500),
  IN p_idArete INT
)
BEGIN
  DECLARE v_idAnimalCria INT;
  DECLARE v_idHatoMadre INT;
  DECLARE v_idFincaMadre INT;

  SELECT
    `idHato`,
    `idFinca`
  INTO
    v_idHatoMadre,
    v_idFincaMadre
  FROM `ganadodb`.`animal`
  WHERE `idAnimal` = p_idAnimalMadre;

  INSERT INTO `ganadodb`.`animal` (
    `codigo`,
    `codigoAlterno`,
    `idRaza`,
    `idColor`,
    `sexo`,
    `descripcion`,
    `idAnimalPadre`,
    `idAnimalMadre`,
    `idHato`,
    `idFinca`,
    `idArete`
  )
  VALUES (
    p_codigo,
    p_codigoAlterno,
    p_idRaza,
    p_idColor,
    p_sexo,
    p_descripcion,
    p_idAnimalPadre,
    p_idAnimalMadre,
    v_idHatoMadre,
    v_idFincaMadre,
    p_idArete
  );

  SET v_idAnimalCria = LAST_INSERT_ID();

  UPDATE `ganadodb`.`animal`
  SET
    `fechaActivo` = p_fecha,
    `fechaNacimiento` = p_fecha
  WHERE `idAnimal` = v_idAnimalCria;

  INSERT INTO `ganadodb`.`parto` (
    `idAnimalMadre`,
    `idAnimalPadre`,
    `idAnimalCria`,
    `idEstadoParto`,
    `fecha`,
    `peso`
  )
  VALUES (
    p_idAnimalMadre,
    p_idAnimalPadre,
    v_idAnimalCria,
    p_idEstadoParto,
    p_fecha,
    p_peso
  );
END $$
DELIMITER ;

DROP VIEW IF EXISTS `ganadodb`.`_vw_pesajes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ganadodb`.`_vw_pesajes` AS
SELECT
  base.idPesaje,
  base.idHato,
  base.idAnimal,
  base.fecha,
  DATE_FORMAT(base.fecha, '%Y-%m-%d') AS ymdFecha,
  base.pesoKg,
  base.observacion,
  base.codigoAnimal,
  base.nombreAnimal,
  base.nombreHato,
  IFNULL(ROUND(base.pesoKg - base.pesoInicial, 2), 0) AS difPesoKgDias,
  IFNULL(ROUND((base.pesoKg - base.pesoInicial) / 31, 4), 0) AS GananciaKgxDia
FROM (
  SELECT
    p.idPesaje,
    p.idHato,
    p.idAnimal,
    p.fecha,
    p.pesoKg,
    p.observacion,
    CONCAT_WS(' - ', NULLIF(a.codigo, ''), NULLIF(a.codigoAlterno, '')) AS codigoAnimal,
    a.nombre AS nombreAnimal,
    h.nombre AS nombreHato,
    FIRST_VALUE(p.pesoKg) OVER (
      PARTITION BY p.idAnimal
      ORDER BY p.fecha, p.idPesaje
    ) AS pesoInicial
  FROM `ganadodb`.`pesaje` p
  LEFT JOIN `ganadodb`.`animal` a ON a.idAnimal = p.idAnimal
  LEFT JOIN `ganadodb`.`hato` h ON h.idHato = p.idHato
  WHERE p.pesoKg > 0
) base;

DROP VIEW IF EXISTS `ganadodb`.`_vw_palpaciones`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ganadodb`.`_vw_palpaciones` AS
SELECT p.idPalpacion,
       p.idAnimalVaca,
       p.idHato,
       p.fecha,
       DATE_FORMAT(p.fecha, '%d-%m-%Y') AS fechaFormateada,
       p.idEstadoPalpacion,
       p.resultadoPrenez,
       p.descripcion,
       p.idVeterinario,
       a.codigo AS codigoAnimal,
       a.nombre AS nombreAnimal,
       h.nombre AS nombreHato,
       ep.nombre AS nombreEstadoPalpacion,
       v.nombre AS nombreVeterinario
FROM `ganadodb`.`palpacion` p
LEFT JOIN `ganadodb`.`animal` a ON a.idAnimal = p.idAnimalVaca
LEFT JOIN `ganadodb`.`hato` h ON h.idHato = p.idHato
LEFT JOIN `ganadodb`.`estado_palpacion` ep ON ep.idEstadoPalpacion = p.idEstadoPalpacion
LEFT JOIN `ganadodb`.`veterinario` v ON v.idVeterinario = p.idVeterinario;

DROP PROCEDURE IF EXISTS `ganadodb`.`sp_registrar_palpacion`;
DELIMITER $$
CREATE PROCEDURE `ganadodb`.`sp_registrar_palpacion`(
  IN p_idAnimalVaca INT,
  IN p_idHato INT,
  IN p_fecha DATE,
  IN p_idEstadoPalpacion INT,
  IN p_resultadoPrenez DECIMAL(4,1),
  IN p_descripcion VARCHAR(500),
  IN p_idVeterinario INT
)
BEGIN
  INSERT INTO `ganadodb`.`palpacion` (
    `idAnimalVaca`,
    `idHato`,
    `fecha`,
    `idEstadoPalpacion`,
    `resultadoPrenez`,
    `descripcion`,
    `idVeterinario`
  )
  VALUES (
    p_idAnimalVaca,
    p_idHato,
    p_fecha,
    p_idEstadoPalpacion,
    p_resultadoPrenez,
    p_descripcion,
    p_idVeterinario
  );
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `ganadodb`.`sp_generar_notificaciones`;
DROP VIEW IF EXISTS `ganadodb`.`_vw_notificaciones`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ganadodb`.`_vw_notificaciones` AS
SELECT
  n.`idNotificacion` AS `idNotificacion`,
  n.`codigo` AS `codigoNotificacion`,
  n.`nombre` AS `nombreNotificacion`,
  n.`idTipoNotificacion` AS `idTipoNotificacion`,
  tn.`codigo` AS `codigoTipoNotificacion`,
  tn.`notificacionClass` AS `notificacionClass`,
  n.`condicionDias` AS `condicionDias`,
  n.`fechaInicioDias` AS `fechaInicioDias`,
  n.`fechaFinalDias` AS `fechaFinalDias`,
  n.`criterio` AS `criterio`,
  n.`instrucciones` AS `instrucciones`,
  a.`idAnimal` AS `idAnimal`,
  a.`codigo` AS `codigoAnimal`,
  a.`nombre` AS `nombreAnimal`,
  a.`fechaNacimiento` AS `fechaNacimiento`,
  DATEDIFF(CURDATE(), a.`fechaNacimiento`) AS `diasAnimal`,
  'CONDICION_DIAS' AS `tipoRegla`
FROM `ganadodb`.`animal` a
INNER JOIN `ganadodb`.`notificacion` n
  ON n.`condicionDias` IS NOT NULL
 AND DATEDIFF(CURDATE(), a.`fechaNacimiento`) = n.`condicionDias`
LEFT JOIN `ganadodb`.`tipo_notificacion` tn
  ON n.`idTipoNotificacion` = tn.`idTipoNotificacion`
WHERE a.`fechaNacimiento` IS NOT NULL

UNION ALL

SELECT
  n.`idNotificacion` AS `idNotificacion`,
  n.`codigo` AS `codigoNotificacion`,
  n.`nombre` AS `nombreNotificacion`,
  n.`idTipoNotificacion` AS `idTipoNotificacion`,
  tn.`codigo` AS `codigoTipoNotificacion`,
  tn.`notificacionClass` AS `notificacionClass`,
  n.`condicionDias` AS `condicionDias`,
  n.`fechaInicioDias` AS `fechaInicioDias`,
  n.`fechaFinalDias` AS `fechaFinalDias`,
  n.`criterio` AS `criterio`,
  n.`instrucciones` AS `instrucciones`,
  a.`idAnimal` AS `idAnimal`,
  a.`codigo` AS `codigoAnimal`,
  a.`nombre` AS `nombreAnimal`,
  a.`fechaNacimiento` AS `fechaNacimiento`,
  DATEDIFF(CURDATE(), a.`fechaNacimiento`) AS `diasAnimal`,
  'RANGO_DIAS' AS `tipoRegla`
FROM `ganadodb`.`animal` a
INNER JOIN `ganadodb`.`notificacion` n
  ON n.`fechaInicioDias` IS NOT NULL
 AND n.`fechaFinalDias` IS NOT NULL
 AND DATEDIFF(CURDATE(), a.`fechaNacimiento`) BETWEEN n.`fechaInicioDias` AND n.`fechaFinalDias`
LEFT JOIN `ganadodb`.`tipo_notificacion` tn
  ON n.`idTipoNotificacion` = tn.`idTipoNotificacion`
WHERE a.`fechaNacimiento` IS NOT NULL;

DROP VIEW IF EXISTS `ganadodb`.`_vw_ganado`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ganadodb`.`_vw_ganado` AS
SELECT 
  `a`.`idAnimal` AS `idAnimal`,
  `a`.`codigo` AS `codigo`,
  `a`.`codigoAlterno` AS `codigoAlterno`,
  `a`.`fechaNacimiento` AS `fechaNacimiento`,
  `a`.`nombre` AS `nombre`,
  `a`.`sexo` AS `sexo`,
  `a`.`descripcion` AS `descripcion`,
  `a`.`idEstadoAnimal` AS `idEstadoAnimal`,
  `a`.`fechaActivo` AS `fechaActivo`,
  `a`.`fechaInactivo` AS `fechaInactivo`,
  `a`.`idRaza` AS `idRaza`,
  `a`.`idColor` AS `idColor`,
  `a`.`idCicloVital` AS `idCicloVital`,
  `a`.`idAnimalPadre` AS `idAnimalPadre`,
  `a`.`idAnimalMadre` AS `idAnimalMadre`,
  `a`.`idHato` AS `idHato`,
  `a`.`idFinca` AS `idFinca`,
  `a`.`idArete` AS `idArete`,
  DATE_FORMAT(`a`.`fechaNacimiento`,'%d-%m-%Y') AS `NewFecNac`,
  DATE_FORMAT(`a`.`fechaActivo`,'%d-%m-%Y') AS `NewFecAct`,
  DATE_FORMAT(`a`.`fechaInactivo`,'%d-%m-%Y') AS `NewFecIna`,
  DATE_FORMAT(`a`.`fechaNacimiento`,'%Y-%m-%d') AS `ymdFecNac`,
  DATE_FORMAT(`a`.`fechaActivo`,'%Y-%m-%d') AS `ymdFecAct`,
  DATE_FORMAT(`a`.`fechaInactivo`,'%Y-%m-%d') AS `ymdFecIna`,
  `c`.`nombre` AS `nombreColor`,
  `r`.`nombre` AS `nombreRaza`,
  `f`.`nombre` AS `nombreFinca`,
  `h`.`nombre` AS `nombreHato`,
  `ap`.`codigo` AS `codigoPadre`,
  `am`.`codigo` AS `codigoMadre`,
  `cv`.`nombre` AS `nombreCicloVital`,
  `ar`.`nombre` AS `nombreArete`,
  `ea`.`nombre` AS `nombreEstadoAnimal`
FROM `ganadodb`.`animal` `a`
LEFT JOIN `ganadodb`.`color` `c` ON `a`.`idColor` = `c`.`idcolor`
LEFT JOIN `ganadodb`.`raza` `r` ON `a`.`idRaza` = `r`.`idraza`
LEFT JOIN `ganadodb`.`finca` `f` ON `a`.`idFinca` = `f`.`idFinca`
LEFT JOIN `ganadodb`.`hato` `h` ON `a`.`idHato` = `h`.`idHato`
LEFT JOIN `ganadodb`.`animal` `ap` ON `a`.`idAnimalPadre` = `ap`.`idAnimal`
LEFT JOIN `ganadodb`.`animal` `am` ON `a`.`idAnimalMadre` = `am`.`idAnimal`
LEFT JOIN `ganadodb`.`ciclovital` `cv` ON `a`.`idCicloVital` = `cv`.`idCicloVital`
LEFT JOIN `ganadodb`.`arete` `ar` ON `a`.`idArete` = `ar`.`idArete`
LEFT JOIN `ganadodb`.`estado_animal` `ea` ON `a`.`idEstadoAnimal` = `ea`.`idEstadoAnimal`;
