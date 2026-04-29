USE ganadodb;

/*
  Recreate all app/report views as SQL SECURITY INVOKER to avoid
  DEFINER issues (for example, root@localhost not existing in Azure/MySQL managed envs).

  This script targets views starting with:
  - _vw_
  - _vw_rpt_
*/

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_recreate_views_invoker $$

CREATE PROCEDURE sp_recreate_views_invoker()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_name VARCHAR(255);
    DECLARE v_def LONGTEXT;

    DECLARE cur CURSOR FOR
        SELECT TABLE_NAME, VIEW_DEFINITION
        FROM information_schema.VIEWS
        WHERE TABLE_SCHEMA = 'ganadodb'
          AND (
              TABLE_NAME LIKE '\\_vw\\_%' ESCAPE '\\'
              OR TABLE_NAME LIKE '\\_vw\\_rpt\\_%' ESCAPE '\\'
          );

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_name, v_def;

        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        SET @sql_stmt = CONCAT(
            'CREATE OR REPLACE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `ganadodb`.`',
            v_name,
            '` AS ',
            v_def
        );

        PREPARE stmt FROM @sql_stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END $$

DELIMITER ;

CALL sp_recreate_views_invoker();
DROP PROCEDURE IF EXISTS sp_recreate_views_invoker;

/* Validation */
SELECT
    TABLE_NAME,
    SECURITY_TYPE,
    DEFINER
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'ganadodb'
  AND (
      TABLE_NAME LIKE '\\_vw\\_%' ESCAPE '\\'
      OR TABLE_NAME LIKE '\\_vw\\_rpt\\_%' ESCAPE '\\'
  )
ORDER BY TABLE_NAME;
