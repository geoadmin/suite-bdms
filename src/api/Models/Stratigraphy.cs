﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BDMS.Models;

/// <summary>
/// Represents a stratigraphy entity in the database.
/// </summary>
[Table("stratigraphy")]
public class Stratigraphy : IChangeTracking, IIdentifyable
{
    /// <inheritdoc />
    [Column("id_sty")]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the foreign key for the <see cref="Borehole"/> associated  with the <see cref="Stratigraphy"/>.
    /// </summary>
    [Column("id_bho_fk")]
    public int? BoreholeId { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Borehole"/> associated  with the <see cref="Stratigraphy"/>.
    /// </summary>
    public Borehole? Borehole { get; set; }

    /// <summary>
    /// Gets or sets whether the <see cref="Stratigraphy"/> is primary.
    /// </summary>
    [Column("primary_sty")]
    public bool? IsPrimary { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Stratigraphy"/>'s date.
    /// </summary>
    [Column("date_sty")]
    public DateTime? Date { get; set; }

    /// <inheritdoc />
    [Column("update_sty")]
    public DateTime? Updated { get; set; }

    /// <inheritdoc />
    [Column("updater_sty")]
    public int? UpdatedById { get; set; }

    /// <inheritdoc />
    public User? UpdatedBy { get; set; }

    /// <inheritdoc />
    [Column("creation_sty")]
    public DateTime? Created { get; set; }

    /// <inheritdoc />
    [Column("author_sty")]
    public int? CreatedById { get; set; }

    /// <inheritdoc />
    public User? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Stratigraphy"/>'s name.
    /// </summary>
    [Column("name_sty")]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Stratigraphy"/>'s kind id.
    /// </summary>
    [Column("kind_id_cli")]
    public int KindId { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Stratigraphy"/>'s kind.
    /// </summary>
    public Codelist? Kind { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="Stratigraphy"/>'s notes.
    /// </summary>
    [Column("notes_sty")]
    public string? Notes { get; set; }

    /// <summary>
    /// Gets the <see cref="Layer"/>s associated with the <see cref="Stratigraphy"/>.
    /// </summary>
    public ICollection<Layer>? Layers { get; }

    /// <summary>
    /// Gets the <see cref="LithologicalDescription"/>s associated with the <see cref="Stratigraphy"/>.
    /// </summary>
    public ICollection<LithologicalDescription>? LithologicalDescriptions { get; }

    /// <summary>
    /// Gets the <see cref="FaciesDescription"/>s associated with the <see cref="Stratigraphy"/>.
    /// </summary>
    public ICollection<FaciesDescription>? FaciesDescriptions { get; }

    /// <summary>
    /// Gets the <see cref="ChronostratigraphyLayer"/>s associated with the <see cref="Stratigraphy"/>.
    /// </summary>
    public ICollection<ChronostratigraphyLayer>? ChronostratigraphyLayers { get; }

    /// <summary>
    /// Gets the <see cref="LithostratigraphyLayer"/>s associated with the <see cref="Stratigraphy"/>.
    /// </summary>
    public ICollection<LithostratigraphyLayer>? LithostratigraphyLayers { get; }
}
