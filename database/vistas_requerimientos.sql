USE ganadodb;

/*
  Requerimiento 1
  Enfermedades historicas por animal
*/
DROP VIEW IF EXISTS ganadodb._vw_rpt_01_enfermedades_historicas_por_animal;
CREATE VIEW ganadodb._vw_rpt_01_enfermedades_historicas_por_animal AS
SELECT
    a.idAnimal,
    a.codigo AS codigoAnimal,
    a.nombre AS nombreAnimal,
    e.idEnfermedad,
    e.codigo AS codigoEnfermedad,
    e.nombre AS nombreEnfermedad,
    COUNT(*) AS vecesRegistrada,
    GROUP_CONCAT(
        DISTINCT CONCAT(IFNULL(p.codigo, ''), ' - ', IFNULL(p.nombre, ''))
        ORDER BY p.codigo
        SEPARATOR '; '
    ) AS paquetesRelacionados
FROM ganadodb.sintomas_bovinos sb
INNER JOIN ganadodb.animal a ON a.idAnimal = sb.idAnimal
INNER JOIN ganadodb.enfermedad e ON e.idEnfermedad = sb.idEnfermedad
LEFT JOIN ganadodb.paquete p ON p.idPaquete = sb.idPaquete
GROUP BY
    a.idAnimal,
    a.codigo,
    a.nombre,
    e.idEnfermedad,
    e.codigo,
    e.nombre;

/*
  Requerimiento 2
  Animales prontos para celo (incluye ventana de -40 dias y toros relacionados)
  Periodo de gestacion referencial por raza + sexo de la ultima cria conocida
*/
DROP VIEW IF EXISTS ganadodb._vw_rpt_02_animales_prontos_celo;
CREATE VIEW ganadodb._vw_rpt_02_animales_prontos_celo AS
SELECT
    a.idAnimal,
    a.codigo AS codigoVaca,
    a.nombre AS nombreVaca,
    r.nombre AS razaVaca,
    lc.fechaInicio AS fechaUltimoCelo,
    lp.fecha AS fechaUltimoParto,
    lp.sexoCria AS sexoUltimaCria,
    tr.torosRelacionados,
    CASE
        WHEN lp.fecha IS NOT NULL AND (lc.fechaInicio IS NULL OR lp.fecha >= lc.fechaInicio)
            THEN DATE_ADD(lp.fecha, INTERVAL 40 DAY)
        WHEN lc.fechaInicio IS NOT NULL
            THEN DATE_ADD(lc.fechaInicio, INTERVAL 21 DAY)
        ELSE NULL
    END AS fechaProximoCeloEstimado,
    DATEDIFF(
        CASE
            WHEN lp.fecha IS NOT NULL AND (lc.fechaInicio IS NULL OR lp.fecha >= lc.fechaInicio)
                THEN DATE_ADD(lp.fecha, INTERVAL 40 DAY)
            WHEN lc.fechaInicio IS NOT NULL
                THEN DATE_ADD(lc.fechaInicio, INTERVAL 21 DAY)
            ELSE NULL
        END,
        CURDATE()
    ) AS diasParaProximoCelo,
    CASE
        WHEN (
            CASE
                WHEN lp.fecha IS NOT NULL AND (lc.fechaInicio IS NULL OR lp.fecha >= lc.fechaInicio)
                    THEN DATE_ADD(lp.fecha, INTERVAL 40 DAY)
                WHEN lc.fechaInicio IS NOT NULL
                    THEN DATE_ADD(lc.fechaInicio, INTERVAL 21 DAY)
                ELSE NULL
            END
        ) BETWEEN DATE_SUB(CURDATE(), INTERVAL 40 DAY) AND DATE_ADD(CURDATE(), INTERVAL 15 DAY)
            THEN 'EN_RANGO_-40_A_+15'
        ELSE 'FUERA_DE_RANGO'
    END AS estadoRangoFechas,
    CASE
        WHEN UPPER(IFNULL(r.nombre, '')) LIKE '%BRAHMAN%' AND UPPER(IFNULL(lp.sexoCria, '')) IN ('MACHO', 'M') THEN 285
        WHEN UPPER(IFNULL(r.nombre, '')) LIKE '%BRAHMAN%' AND UPPER(IFNULL(lp.sexoCria, '')) IN ('HEMBRA', 'H', 'F') THEN 283
        WHEN UPPER(IFNULL(r.nombre, '')) LIKE '%HOLSTEIN%' AND UPPER(IFNULL(lp.sexoCria, '')) IN ('MACHO', 'M') THEN 281
        WHEN UPPER(IFNULL(r.nombre, '')) LIKE '%HOLSTEIN%' AND UPPER(IFNULL(lp.sexoCria, '')) IN ('HEMBRA', 'H', 'F') THEN 279
        WHEN UPPER(IFNULL(lp.sexoCria, '')) IN ('MACHO', 'M') THEN 285
        WHEN UPPER(IFNULL(lp.sexoCria, '')) IN ('HEMBRA', 'H', 'F') THEN 283
        ELSE 283
    END AS periodoGestacionReferencialDias
FROM ganadodb.animal a
LEFT JOIN ganadodb.raza r
    ON r.idraza = a.idRaza
LEFT JOIN (
    SELECT x.idAnimalVaca, x.idAnimalToro, x.fechaInicio
    FROM (
        SELECT
            c.idAnimalVaca,
            c.idAnimalToro,
            c.fechaInicio,
            ROW_NUMBER() OVER (PARTITION BY c.idAnimalVaca ORDER BY c.fechaInicio DESC, c.idCelo DESC) AS rn
        FROM ganadodb.celo c
    ) x
    WHERE x.rn = 1
) lc ON lc.idAnimalVaca = a.idAnimal
LEFT JOIN (
    SELECT x.idAnimalMadre, x.idAnimalPadre, x.fecha, x.sexoCria
    FROM (
        SELECT
            p.idAnimalMadre,
            p.idAnimalPadre,
            p.fecha,
            ac.sexo AS sexoCria,
            ROW_NUMBER() OVER (PARTITION BY p.idAnimalMadre ORDER BY p.fecha DESC, p.idParto DESC) AS rn
        FROM ganadodb.parto p
        LEFT JOIN ganadodb.animal ac ON ac.idAnimal = p.idAnimalCria
    ) x
    WHERE x.rn = 1
) lp ON lp.idAnimalMadre = a.idAnimal
LEFT JOIN (
    SELECT
        z.idAnimalVaca,
        GROUP_CONCAT(DISTINCT z.toroLabel ORDER BY z.toroLabel SEPARATOR ', ') AS torosRelacionados
    FROM (
        SELECT
            c.idAnimalVaca,
            CONCAT(IFNULL(at.codigo, ''), ' - ', IFNULL(at.nombre, '')) AS toroLabel
        FROM ganadodb.celo c
        LEFT JOIN ganadodb.animal at ON at.idAnimal = c.idAnimalToro

        UNION ALL

        SELECT
            p.idAnimalMadre AS idAnimalVaca,
            CONCAT(IFNULL(at.codigo, ''), ' - ', IFNULL(at.nombre, '')) AS toroLabel
        FROM ganadodb.parto p
        LEFT JOIN ganadodb.animal at ON at.idAnimal = p.idAnimalPadre
    ) z
    GROUP BY z.idAnimalVaca
) tr ON tr.idAnimalVaca = a.idAnimal
WHERE TRIM(UPPER(IFNULL(a.sexo, ''))) IN ('HEMBRA', 'H', 'F');

/*
  Requerimiento 3
  Periodo de gestacion y control de objetivo: una cria por ano (vacas aneras)
*/
DROP VIEW IF EXISTS ganadodb._vw_rpt_03_periodo_gestacion_y_objetivo_anual;
CREATE VIEW ganadodb._vw_rpt_03_periodo_gestacion_y_objetivo_anual AS
SELECT
    p2.idParto,
    p2.idAnimalMadre,
    a.codigo AS codigoVaca,
    a.nombre AS nombreVaca,
    r.nombre AS razaVaca,
    p2.fechaPartoActual,
    p2.fechaPartoSiguiente,
    CASE
        WHEN p2.fechaPartoSiguiente IS NOT NULL
            THEN DATEDIFF(p2.fechaPartoSiguiente, p2.fechaPartoActual)
        ELSE NULL
    END AS diasEntrePartos,
    (
        SELECT MAX(c.fechaInicio)
        FROM ganadodb.celo c
        WHERE c.idAnimalVaca = p2.idAnimalMadre
          AND c.fechaInicio <= p2.fechaPartoActual
    ) AS fechaUltimoCeloAntesParto,
    CASE
        WHEN (
            SELECT MAX(c.fechaInicio)
            FROM ganadodb.celo c
            WHERE c.idAnimalVaca = p2.idAnimalMadre
              AND c.fechaInicio <= p2.fechaPartoActual
        ) IS NOT NULL
            THEN DATEDIFF(
                p2.fechaPartoActual,
                (
                    SELECT MAX(c.fechaInicio)
                    FROM ganadodb.celo c
                    WHERE c.idAnimalVaca = p2.idAnimalMadre
                      AND c.fechaInicio <= p2.fechaPartoActual
                )
            )
        ELSE NULL
    END AS duracionGestacionDias,
    CASE
        WHEN p2.fechaPartoSiguiente IS NULL THEN 'SIN_SIGUIENTE_PARTO'
        WHEN DATEDIFF(p2.fechaPartoSiguiente, p2.fechaPartoActual) BETWEEN 320 AND 410 THEN 'CUMPLE_OBJETIVO'
        ELSE 'NO_CUMPLE_OBJETIVO'
    END AS estadoObjetivoUnaCriaPorAno
FROM (
    SELECT
        p.idParto,
        p.idAnimalMadre,
        p.fecha AS fechaPartoActual,
        LEAD(p.fecha) OVER (PARTITION BY p.idAnimalMadre ORDER BY p.fecha, p.idParto) AS fechaPartoSiguiente
    FROM ganadodb.parto p
) p2
INNER JOIN ganadodb.animal a ON a.idAnimal = p2.idAnimalMadre
LEFT JOIN ganadodb.raza r ON r.idraza = a.idRaza;

/*
  Requerimiento 4
  Kilogramo x dia x animal y promedio para hato
*/
DROP VIEW IF EXISTS ganadodb._vw_rpt_04_kg_dia_animal_promedio_hato;
CREATE VIEW ganadodb._vw_rpt_04_kg_dia_animal_promedio_hato AS
SELECT
    b.idPesaje,
    b.idHato,
    h.nombre AS nombreHato,
    b.idAnimal,
    a.codigo AS codigoAnimal,
    a.nombre AS nombreAnimal,
    b.fecha,
    b.pesoKg,
    b.fechaAnterior,
    b.pesoAnteriorKg,
    b.diasTranscurridos,
    ROUND((b.pesoKg - b.pesoAnteriorKg), 2) AS gananciaKgPeriodo,
    ROUND((b.pesoKg - b.pesoAnteriorKg) / NULLIF(b.diasTranscurridos, 0), 4) AS kgPorDiaAnimal,
    ROUND(
        AVG((b.pesoKg - b.pesoAnteriorKg) / NULLIF(b.diasTranscurridos, 0))
        OVER (PARTITION BY b.idAnimal),
        4
    ) AS promedioKgPorDiaAnimal,
    ROUND(
        AVG((b.pesoKg - b.pesoAnteriorKg) / NULLIF(b.diasTranscurridos, 0))
        OVER (PARTITION BY b.idHato),
        4
    ) AS promedioKgPorDiaHato
FROM (
    SELECT
        p.idPesaje,
        p.idHato,
        p.idAnimal,
        p.fecha,
        p.pesoKg,
        LAG(p.fecha) OVER (PARTITION BY p.idAnimal ORDER BY p.fecha, p.idPesaje) AS fechaAnterior,
        LAG(p.pesoKg) OVER (PARTITION BY p.idAnimal ORDER BY p.fecha, p.idPesaje) AS pesoAnteriorKg,
        DATEDIFF(
            p.fecha,
            LAG(p.fecha) OVER (PARTITION BY p.idAnimal ORDER BY p.fecha, p.idPesaje)
        ) AS diasTranscurridos
    FROM ganadodb.pesaje p
) b
INNER JOIN ganadodb.animal a ON a.idAnimal = b.idAnimal
LEFT JOIN ganadodb.hato h ON h.idHato = b.idHato
WHERE b.fechaAnterior IS NOT NULL
  AND b.diasTranscurridos > 0;

/*
  Requerimiento 5
  Consanguinidad por hato (parentesco entre animales del mismo hato)
  Solo se incluyen animales ACTIVOS (excluye vendidos y muertos).
  Regla de descendientes: solo la descendiente HEMBRA representa riesgo
  de consanguinidad al permanecer en el mismo hato que su padre o madre.
  El descendiente MACHO no se incluye.
*/
DROP VIEW IF EXISTS ganadodb._vw_rpt_05_consanguinidad_por_hato;
CREATE VIEW ganadodb._vw_rpt_05_consanguinidad_por_hato AS
SELECT
    rel.idHato,
    h.nombre AS nombreHato,
    rel.idAnimal,
    rel.codigoAnimal,
    rel.nombreAnimal,
    COUNT(*) AS totalRelacionesConsanguinidad,
    GROUP_CONCAT(
        DISTINCT CONCAT(rel.tipoRelacion, ': ', IFNULL(rel.codigoRelacionado, ''), ' - ', IFNULL(rel.nombreRelacionado, ''))
        ORDER BY rel.tipoRelacion, rel.codigoRelacionado
        SEPARATOR '; '
    ) AS detalleConsanguinidad
FROM (
    SELECT
        a1.idHato,
        a1.idAnimal,
        a1.codigo AS codigoAnimal,
        a1.nombre AS nombreAnimal,
        a2.idAnimal AS idAnimalRelacionado,
        a2.codigo AS codigoRelacionado,
        a2.nombre AS nombreRelacionado,
        CASE
            WHEN a2.idAnimal = a1.idAnimalPadre THEN 'PADRE'
            WHEN a2.idAnimal = a1.idAnimalMadre THEN 'MADRE'
            WHEN (a1.idAnimal = a2.idAnimalPadre OR a1.idAnimal = a2.idAnimalMadre)
                 AND TRIM(UPPER(IFNULL(a2.sexo, ''))) IN ('HEMBRA', 'H', 'F') THEN 'DESCENDIENTE_HEMBRA'
            WHEN a1.idAnimalPadre IS NOT NULL
                 AND a1.idAnimalMadre IS NOT NULL
                 AND a1.idAnimalPadre = a2.idAnimalPadre
                 AND a1.idAnimalMadre = a2.idAnimalMadre THEN 'HERMANO_COMPLETO'
            WHEN a1.idAnimalPadre IS NOT NULL
                 AND a1.idAnimalPadre = a2.idAnimalPadre THEN 'MEDIO_HERMANO_PATERNO'
            WHEN a1.idAnimalMadre IS NOT NULL
                 AND a1.idAnimalMadre = a2.idAnimalMadre THEN 'MEDIO_HERMANO_MATERNO'
            ELSE NULL
        END AS tipoRelacion
    FROM ganadodb.animal a1
    INNER JOIN ganadodb.estado_animal ea1
        ON ea1.idEstadoAnimal = a1.idEstadoAnimal
       AND UPPER(ea1.nombre) LIKE '%ACTIV%'
    INNER JOIN ganadodb.animal a2
        ON a1.idHato = a2.idHato
       AND a1.idAnimal <> a2.idAnimal
    INNER JOIN ganadodb.estado_animal ea2
        ON ea2.idEstadoAnimal = a2.idEstadoAnimal
       AND UPPER(ea2.nombre) LIKE '%ACTIV%'
    WHERE a1.idHato IS NOT NULL
      AND (
          a2.idAnimal = a1.idAnimalPadre
          OR a2.idAnimal = a1.idAnimalMadre
          OR (
              (a1.idAnimal = a2.idAnimalPadre OR a1.idAnimal = a2.idAnimalMadre)
              AND TRIM(UPPER(IFNULL(a2.sexo, ''))) IN ('HEMBRA', 'H', 'F')
          )
          OR (a1.idAnimalPadre IS NOT NULL AND a1.idAnimalPadre = a2.idAnimalPadre)
          OR (a1.idAnimalMadre IS NOT NULL AND a1.idAnimalMadre = a2.idAnimalMadre)
      )
) rel
LEFT JOIN ganadodb.hato h ON h.idHato = rel.idHato
WHERE rel.tipoRelacion IS NOT NULL
GROUP BY
    rel.idHato,
    h.nombre,
    rel.idAnimal,
    rel.codigoAnimal,
    rel.nombreAnimal;
