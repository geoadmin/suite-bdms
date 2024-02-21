﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BDMS.Models;

/// <summary>
/// Join table entity for a <see cref="Models.Codelist"/> with the schemaName 'grain_shape' attached to a <see cref="Models.Layer"/>.
/// </summary>
[Table("layer_grain_shape_codelist")]
public class LayerGrainShapeCode : ILayerCode
{
    [Column("id_lay_fk")]
    public int LayerId { get; set; }
    public Layer Layer { get; set; }

    [Column("id_cli_fk")]
    public int CodelistId { get; set; }
    public Codelist Codelist { get; set; }
}
