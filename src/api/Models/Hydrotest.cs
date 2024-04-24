﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BDMS.Models;

/// <summary>
/// Represents a hydrotest in the boring process.
/// </summary>
public class Hydrotest : Observation
{
    /// <summary>
    /// Gets or sets the codelist ids with schema name 'hydrotest_kind' of the <see cref="Hydrotest"/>'s many to many codelist relations.
    /// </summary>
    [NotMapped]
    public ICollection<int>? KindCodelistIds { get; set; } = new List<int>();

    /// <summary>
    /// Gets the <see cref="Codelist"/>s with schema name 'hydrotest_kind' used by the <see cref="Hydrotest"/>.
    /// </summary>
    public ICollection<Codelist>? KindCodelists { get; set; }

    /// <summary>
    /// Gets or sets the codelist ids with schema name 'hydrotest_flowdirection' of the <see cref="Hydrotest"/>'s many to many codelist relations.
    /// </summary>
    [NotMapped]
    public ICollection<int>? FlowDirectionCodelistIds { get; set; } = new List<int>();

    /// <summary>
    /// Gets the <see cref="Codelist"/>s with schema name 'hydrotest_flowdirection' used by the <see cref="Hydrotest"/>.
    /// </summary>
    public ICollection<Codelist>? FlowDirectionCodelists { get; set; }

    /// <summary>
    /// Gets or sets the codelist ids with schema name 'hydrotest_evaluationmethod' of the <see cref="Hydrotest"/>'s many to many codelist relations.
    /// </summary>
    [NotMapped]
    public ICollection<int>? EvaluationMethodCodelistIds { get; set; } = new List<int>();

    /// <summary>
    /// Gets the <see cref="Codelist"/>s with schema name 'hydrotest_evaluationmethod' used by the <see cref="Hydrotest"/>.
    /// </summary>
    public ICollection<Codelist>? EvaluationMethodCodelists { get; set; }

    /// <summary>
    /// Gets or sets the codelist ids with schema name 'hydrotest_result' of the <see cref="Hydrotest"/>'s many to many codelist relations.
    /// </summary>
    [NotMapped]
    public ICollection<int>? ResultParameterCodelistIds { get; set; } = new List<int>();

    /// <summary>
    /// Gets the <see cref="Codelist"/>s with schema name 'hydrotest_result' used by the <see cref="Hydrotest"/>.
    /// </summary>
    public ICollection<Codelist>? ResultParameterCodelists { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="HydrotestKindCode"/> join table entities.
    /// </summary>
    [JsonIgnore]
    public IList<HydrotestKindCode>? HydrotestKindCodes { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="HydrotestEvaluationMethodCode"/> join table entities.
    /// </summary>
    [JsonIgnore]
    public IList<HydrotestEvaluationMethodCode>? HydrotestEvaluationMethodCodes { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="HydrotestFlowDirectionCode"/> join table entities.
    /// </summary>
    [JsonIgnore]
    public IList<HydrotestFlowDirectionCode>? HydrotestFlowDirectionCodes { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="HydrotestResultParameterCode"/> join table entities.
    /// </summary>
    [JsonIgnore]
    public IList<HydrotestResultParameterCode>? HydrotestResultParameterCodes { get; set; }

    /// <summary>
    /// Gets the <see cref="HydrotestResult"/>s associated with the <see cref="Hydrotest"/>.
    /// </summary>
    public ICollection<HydrotestResult>? HydrotestResults { get; set; }
}
