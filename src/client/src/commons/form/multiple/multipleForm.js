import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";

import DomainDropdown from "../domain/dropdown/domainDropdown";
import DomainTree from "../domain/tree/domainTree";
import DateField from "../dateField";
import TranslationText from "../translationText";

import { Header, Input, Button, Form } from "semantic-ui-react";

import { patchBoreholes } from "../../../api-lib/index";

class MultipleForm extends React.Component {
  constructor(props) {
    super(props);
    this.getToggle = this.getToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.save = this.save.bind(this);
    this.isActive = this.isActive.bind(this);
    this.state = {
      // name of the fields that get updated
      fields: [],
      data: {
        // key: field name, also used for translation
        // toggle: name of the toggle button (defaults to field name)
        // api: field identifier for api
        // value: the value of the field
        project_name: { api: "custom.project_name", value: null },
        restriction: { api: "restriction", value: null },
        restriction_until: {
          toggle: "restriction",
          api: "restriction_until",
          value: null,
        },
        kind: { api: "kind", value: null },
        drilling_method: { api: "extended.drilling_method", value: null },
        purpose: { api: "extended.purpose", value: null },
        cuttings: { api: "custom.cuttings", value: null },
        spud_date: { api: "spud_date", value: null },
        drilling_end_date: { api: "drilling_date", value: null },
        drill_diameter: { api: "custom.drill_diameter", value: null },
        boreholestatus: { api: "extended.status", value: null },
        inclination: { api: "inclination", value: null },
        inclination_direction: { api: "inclination_direction", value: null },
        qt_bore_inc_dir: { api: "custom.qt_bore_inc_dir", value: null },
        totaldepth: { api: "total_depth", value: null },
        qt_depth: { api: "custom.qt_top_bedrock", value: null },
        total_depth_tvd: { api: "total_depth_tvd", value: null },
        total_depth_tvd_qt: { api: "qt_total_depth_tvd", value: null },
        top_bedrock: { api: "extended.top_bedrock", value: null },
        qt_top_bedrock: { api: "custom.qt_top_bedrock", value: null },
        top_bedrock_tvd: { api: "extended.top_bedrock_tvd", value: null },
        top_bedrock_tvd_qt: { api: "custom.qt_top_bedrock_tvd", value: null },
        groundwater: { api: "extended.groundwater", value: null },
        lithology_top_bedrock: {
          api: "custom.lithology_top_bedrock",
          value: null,
        },
        lithostratigraphy_top_bedrock: {
          api: "custom.lithostratigraphy_top_bedrock",
          value: null,
        },
        chronostratigraphy_top_bedrock: {
          api: "custom.chronostratigraphy_top_bedrock",
          value: null,
        },
      },
    };
  }

  isActive(field) {
    return _.indexOf(this.state.fields, field) >= 0;
  }

  toggle(fields) {
    const newFields = [...this.state.fields];
    for (const field of fields) {
      let idx = _.indexOf(newFields, field);
      if (idx >= 0) {
        newFields.splice(idx, 1);
      } else {
        newFields.push(field);
      }
    }
    this.setState({
      fields: newFields,
    });
  }

  save() {
    const { undo } = this.props;
    const fields = this.state.fields.map(field => [
      this.state.data[field].api,
      this.state.data[field].value,
    ]);
    patchBoreholes(this.props.selected, fields)
      .then(response => {
        undo();
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  getToggle(fields) {
    const { t } = this.props;
    return (
      <Button
        key={fields[0]}
        active={this.isActive(fields[0])}
        onClick={e => {
          this.toggle(fields);
        }}
        size="mini"
        toggle>
        {t(fields[0])}
      </Button>
    );
  }

  getDomain(field, schema = null) {
    const onSelected = selected =>
      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          [field]: {
            ...this.state.data[field],
            value: selected.id,
          },
        },
      });

    const { t } = this.props;
    if (!this.isActive(field)) {
      return null;
    }
    if (
      [
        "lithology_top_bedrock",
        "lithostratigraphy_top_bedrock",
        "chronostratigraphy_top_bedrock",
      ].includes(field)
    ) {
      return (
        <Form.Field key={field}>
          <label>{t(field)}</label>
          <DomainTree
            levels={{
              1: "rock",
              2: "process",
              3: "type",
            }}
            onSelected={onSelected}
            schema={schema === null ? this.state.data[field].api : schema}
            selected={this.state.data[field].value}
            title={<TranslationText id={field} />}
          />
        </Form.Field>
      );
    } else {
      return (
        <Form.Field key={field}>
          <label>{t(field)}</label>
          <DomainDropdown
            onSelected={onSelected}
            schema={schema === null ? this.state.data[field].api : schema}
            selected={this.state.data[field].value}
          />
        </Form.Field>
      );
    }
  }

  getInput(field, type = "text") {
    const { t } = this.props;
    if (!this.isActive(field)) {
      return null;
    }
    return (
      <Form.Field key={field}>
        <label>{t(field)}</label>
        <Input
          data-cy="text-input"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          onChange={e => {
            let newValue = e.target.value;
            if (type === "number") {
              newValue = _.toNumber(newValue);
            }
            this.setState({
              ...this.state,
              data: {
                ...this.state.data,
                [field]: {
                  ...this.state.data[field],
                  value: newValue,
                },
              },
            });
          }}
          spellCheck="false"
          type={type}
          value={this.state.data[field].value}
        />
      </Form.Field>
    );
  }

  getDate(field, required = false) {
    const { t } = this.props;
    if (!this.isActive(field)) {
      return null;
    }
    return (
      <Form.Field required={required} key={field}>
        <label>{t(field)}</label>
        <DateField
          date={this.state.data[field].value}
          onChange={selected =>
            this.setState({
              ...this.state,
              data: {
                ...this.state.data,
                [field]: {
                  ...this.state.data[field],
                  value: selected,
                },
              },
            })
          }
        />
      </Form.Field>
    );
  }

  getGroup(fields) {
    if (fields.every(f => f === null)) {
      return null;
    }
    return <Form.Group widths="equal">{fields}</Form.Group>;
  }

  render() {
    const { t } = this.props;
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
        <Header>Bulk modification</Header>
        <div
          style={{
            marginBottom: "1em",
            lineHeight: "2.5em",
          }}>
          {Object.entries(
            Object.entries(this.state.data).reduce((toggles, [key, field]) => {
              let group = field.toggle ?? key;
              (toggles[group] = toggles[group] || []).push(key);
              return toggles;
            }, {}),
          ).map(([, fields]) => this.getToggle(fields))}
        </div>
        <div
          style={{
            flex: 1,
            maxHeight: "450px",
            minHeight: "250px",
            overflowY: "auto",
            padding: "0.5em",
          }}>
          {this.state.fields.length === 0
            ? "Please Select the Fields to Edit"
            : null}
          <Form autoComplete="off" error>
            {this.getInput("project_name")}
            {this.getGroup([
              this.getDomain("restriction"),
              this.getDate(
                "restriction_until",
                this.state.data.restriction.value === 20111003,
              ),
            ])}
            {this.getGroup([
              this.getDomain("kind"),
              this.getDomain("drilling_method"),
              this.getDomain("purpose"),
            ])}
            {this.getGroup([
              this.getDomain("cuttings"),
              this.getDate("spud_date"),
              this.getDate("drilling_end_date"),
            ])}
            {this.getGroup([
              this.getInput("drill_diameter", "number"),
              this.getDomain("boreholestatus"),
            ])}
            {this.getGroup([
              this.getInput("inclination", "number"),
              this.getInput("inclination_direction", "number"),
              this.getDomain("qt_bore_inc_dir"),
            ])}
            {this.getGroup([
              this.getInput("totaldepth", "number"),
              this.getDomain("qt_depth"),
            ])}
            {this.getGroup([
              this.getInput("total_depth_tvd", "number"),
              this.getDomain("total_depth_tvd_qt", "custom.qt_top_bedrock"),
            ])}
            {this.getGroup([
              this.getInput("top_bedrock", "number"),
              this.getDomain("qt_top_bedrock"),
            ])}
            {this.getGroup([
              this.getInput("top_bedrock_tvd", "number"),
              this.getDomain("top_bedrock_tvd_qt", "custom.qt_top_bedrock"),
            ])}
            {this.isActive("groundwater") ? (
              <Form.Field required>
                <label>{t("groundwater")}</label>
                <Form.Group inline>
                  <Form.Radio
                    checked={this.state.data.groundwater.value === true}
                    label={t("common:yes")}
                    onChange={(e, d) => {
                      this.setState({
                        ...this.state,
                        data: {
                          ...this.state.data,
                          groundwater: {
                            ...this.state.data.groundwater,
                            value: true,
                          },
                        },
                      });
                    }}
                  />
                  <Form.Radio
                    checked={this.state.data.groundwater.value === false}
                    label={t("common:no")}
                    onChange={(e, d) => {
                      this.setState({
                        ...this.state,
                        data: {
                          ...this.state.data,
                          groundwater: {
                            ...this.state.data.groundwater,
                            value: false,
                          },
                        },
                      });
                    }}
                  />
                  <Form.Radio
                    checked={this.state.data.groundwater.value === null}
                    label={t("common:np")}
                    onChange={(e, d) => {
                      this.setState({
                        ...this.state,
                        data: {
                          ...this.state.data,
                          groundwater: {
                            ...this.state.data.groundwater,
                            value: null,
                          },
                        },
                      });
                    }}
                  />
                </Form.Group>
              </Form.Field>
            ) : null}
            {this.getDomain(
              "lithology_top_bedrock",
              "custom.lithology_top_bedrock",
            )}
            {this.getDomain(
              "lithostratigraphy_top_bedrock",
              "custom.lithostratigraphy_top_bedrock",
            )}
            {this.getDomain(
              "chronostratigraphy_top_bedrock",
              "custom.chronostratigraphy_top_bedrock",
            )}
          </Form>
        </div>
        <div
          style={{
            textAlign: "right",
          }}>
          <Button
            negative
            onClick={() => {
              this.props.undo();
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.save();
            }}
            positive>
            Save
          </Button>
        </div>
      </div>
    );
  }
}

MultipleForm.propTypes = {
  selected: PropTypes.array,
  undo: PropTypes.func,
};

MultipleForm.defaultProps = {
  selected: [],
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    undo: () => {
      dispatch({
        type: "EDITOR_MULTIPLE_SELECTED",
        selection: null,
      });
    },
    // patchBoreholes: (ids, fields) => {
    //   dispatch(patchBoreholes(ids, fields));
    // }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation(["common"])(MultipleForm));
