﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BDMS.Migrations;

/// <inheritdoc />
public partial class MigrateCompletion : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Create a completion for each borehole and migrate all casing layers to the casing table.
        // Delete all casing, backfill and instrumentation layers.
        // Delete all stratigraphy entries for casing, backfill and instrumentation layers.
        // At the time of migration no instrumentation or backfill layers had to be migrated.
        migrationBuilder.Sql(@"
UPDATE bdms.layer SET instr_id_lay_fk = NULL;

DO $$          
DECLARE
	currentStratigraphyRow bdms.stratigraphy%ROWTYPE;
	currentLayerRow bdms.layer%ROWTYPE;
    bhoId INT;
	newCompletionId INT;
BEGIN
	DROP TABLE IF EXISTS bho_completion_link_temp;
	CREATE TEMPORARY TABLE bho_completion_link_temp (
		id SERIAL PRIMARY KEY,
		bho_id INT,
		completion_id INT NULL
	);
	
	-- Insert all bho ids which need to have a completion
	INSERT INTO bho_completion_link_temp (bho_id)
	SELECT
		id_bho_fk
	FROM
		bdms.stratigraphy
	WHERE
		kind_id_cli IN (3002,3003,3004) AND id_bho_fk IS NOT NULL
	GROUP BY id_bho_fk;
	
	-- Create a completion for each borehole
    WHILE (SELECT count(*) FROM bho_completion_link_temp WHERE completion_id IS NULL) > 0
    LOOP
        SELECT bho_id INTO bhoId FROM bho_completion_link_temp WHERE completion_id IS NULL ORDER BY bho_id LIMIT 1;
		
		INSERT INTO bdms.completion(borehole_id, is_primary, name, kind_id, notes, abandon_date, creator, creation, updater, update)
        VALUES (bhoId, true, NULL, 16000000, 
				NULL, NULL, 1, CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
			   ,NULL, NULL) 
        RETURNING id INTO newCompletionId;
		
		UPDATE bho_completion_link_temp
		SET completion_id = newCompletionId
		WHERE bho_id = bhoId;
	END LOOP;
	
	-- Loop through all layers to migrate.
	WHILE (SELECT Count(*) FROM bdms.layer JOIN bdms.stratigraphy ON bdms.layer.id_sty_fk = bdms.stratigraphy.id_sty WHERE bdms.stratigraphy.kind_id_cli IN (3002,3003,3004)) > 0
    LOOP
        SELECT * INTO currentLayerRow 
		FROM bdms.layer 
		WHERE id_lay = (SELECT bdms.layer.id_lay FROM bdms.layer JOIN bdms.stratigraphy ON bdms.layer.id_sty_fk = bdms.stratigraphy.id_sty WHERE bdms.stratigraphy.kind_id_cli IN (3002,3003,3004) LIMIT 1)
		LIMIT 1;
		
		SELECT * INTO currentStratigraphyRow FROM bdms.stratigraphy WHERE id_sty = currentLayerRow.id_sty_fk LIMIT 1;
	
		IF currentStratigraphyRow.kind_id_cli = 3002 THEN
			INSERT INTO bdms.casing(completion_id, name, from_depth, to_depth, kind_id, material_id, inner_diameter, outer_diameter, date_start, date_finish, notes, creator, creation, updater, update)
			VALUES ((Select completion_id FROM bho_completion_link_temp WHERE bho_id = currentStratigraphyRow.id_bho_fk LIMIT 1),
									COALESCE(currentLayerRow.casng_id, ''), COALESCE(currentLayerRow.depth_from_lay, 0), COALESCE(currentLayerRow.depth_to_lay, 0), COALESCE(currentLayerRow.casng_kind_id_cli, 25000107), 
									COALESCE(currentLayerRow.casng_material_id_cli, 25000115), COALESCE(currentLayerRow.casng_inner_diameter_lay, 0), COALESCE(currentLayerRow.casng_outer_diameter_lay, 0),
									COALESCE(currentLayerRow.casng_date_spud_lay, DATE '0001-01-01'), COALESCE(currentLayerRow.casng_date_finish_lay, DATE '0001-01-01'),currentLayerRow.notes_lay,
									1, CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
									,NULL, NULL);
		END IF;

        IF currentStratigraphyRow.kind_id_cli = 3003 THEN
			INSERT INTO bdms.instrumentation(completion_id, from_depth, to_depth, name, kind_id, status_id, notes, creator, creation, updater, update)
			VALUES ((Select completion_id FROM bho_completion_link_temp WHERE bho_id = currentStratigraphyRow.id_bho_fk LIMIT 1),
									COALESCE(currentLayerRow.depth_from_lay, 0), COALESCE(currentLayerRow.depth_to_lay, 0), COALESCE(currentLayerRow.instr_id, ''), COALESCE(currentLayerRow.instr_kind_id_cli, 25000212), 
									COALESCE(currentLayerRow.instr_status_id_cli, 25000217), currentLayerRow.notes_lay,
									1, CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
									,NULL, NULL);
		END IF;

        IF currentStratigraphyRow.kind_id_cli = 3004 THEN
			INSERT INTO bdms.backfill(completion_id, from_depth, to_depth, kind_id, material_id, notes, creator, creation, updater, update)
			VALUES ((Select completion_id FROM bho_completion_link_temp WHERE bho_id = currentStratigraphyRow.id_bho_fk LIMIT 1),
									COALESCE(currentLayerRow.depth_from_lay, 0), COALESCE(currentLayerRow.depth_to_lay, 0), COALESCE(currentLayerRow.fill_kind_id_cli, 25000304), COALESCE(currentLayerRow.fill_material_id_cli, 25000312), 
									currentLayerRow.notes_lay,
									1, CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
									,NULL, NULL);
        END IF;

		DELETE FROM bdms.layer WHERE id_lay = currentLayerRow.id_lay;
	END LOOP;
	
	DELETE FROM bdms.stratigraphy WHERE kind_id_cli = 3003;
	DELETE FROM bdms.stratigraphy WHERE kind_id_cli = 3004;
	DELETE FROM bdms.stratigraphy WHERE kind_id_cli = 3002;
END $$;

DROP TABLE IF EXISTS bho_completion_link_temp;

");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}