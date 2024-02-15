﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BDMS.Models;

/// <summary>
/// Represents a lithological description entity in the database.
/// </summary>
[Table("lithological_description")]
public class LithologicalDescription : ILayerDescription, IChangeTracking, IIdentifyable
{
    /// <inheritdoc />
    [Column("id_ldp")]
    [Key]
    public int Id { get; set; }

    /// <inheritdoc />
    [Column("id_sty_fk")]
    public int StratigraphyId { get; set; }

    /// <inheritdoc />
    public Stratigraphy? Stratigraphy { get; set; }

    /// <inheritdoc />
    [Column("creator")]
    public int? CreatedById { get; set; }

    /// <inheritdoc />
    public User? CreatedBy { get; set; }

    /// <inheritdoc />
    [Column("creation")]
    public DateTime? Created { get; set; }

    /// <inheritdoc />
    [Column("updater")]
    public int? UpdatedById { get; set; }

    /// <inheritdoc />
    public User? UpdatedBy { get; set; }

    /// <inheritdoc />
    [Column("update")]
    public DateTime? Updated { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="LithologicalDescription"/>'s description.
    /// </summary>
    [Column("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the id of the quality of the <see cref="LithologicalDescription"/>'s description.
    /// </summary>
    [Column("qt_description_id")]
    public int? DescriptionQualityId { get; set; }

    /// <summary>
    /// Gets or sets the quality of the <see cref="LithologicalDescription"/>'s description.
    /// </summary>
    public Codelist? DescriptionQuality { get; set; }

    /// <inheritdoc />
    [Column("depth_from")]
    public double? FromDepth { get; set; }

    /// <inheritdoc />
    [Column("depth_to")]
    public double? ToDepth { get; set; }

    /// <inheritdoc />
    [Column("is_last")]
    public bool? IsLast { get; set; }
}
