import React from "react";
import PropTypes from "prop-types";

import { Button, Checkbox, Icon } from "semantic-ui-react";
import TranslationText from "../../form/translationText";

class MapOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.transparency = false;
    this.state = {
      selectedLayer: null,
    };
  }

  render() {
    const { isFetching, layers, moveDown, moveUp, saveTransparency, setTransparency, toggleVisibility } = this.props;

    const len = Object.values(layers).length - 1;

    return (
      <div>
        {Object.values(layers)
          .sort((a, b) => {
            if (a.position < b.position) {
              return 1;
            } else if (a.position > b.position) {
              return -1;
            }
            return 0;
          })
          .map((layer, idx) => (
            <div
              key={"ovls-" + idx}
              style={{
                borderBottom: idx < len ? "thin solid #dcdcdc" : null,
                padding: "0.5em 0px",
              }}>
              <div>
                <Checkbox
                  checked={layer.visibility}
                  disabled={isFetching === true}
                  label={layer.Title}
                  onChange={() => {
                    toggleVisibility(layer);
                  }}
                />
              </div>
              <div
                style={{
                  color: "#787878",
                  fontSize: "0.8em",
                }}>
                <TranslationText id={"transparency"} /> ({layer.transparency}%)
              </div>
              <div
                style={{
                  alignItems: "center",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}>
                <div
                  style={{
                    flex: "1",
                  }}>
                  <input
                    disabled={isFetching === true}
                    max="100"
                    min="0"
                    onChange={ev => {
                      const value = parseFloat(ev.target.value);
                      setTransparency(layer, value);
                      if (saveTransparency !== undefined) {
                        if (this.transparency) {
                          clearTimeout(this.transparency);
                          this.transparency = false;
                        }
                        this.transparency = setTimeout(() => {
                          saveTransparency(layer, value);
                        }, 1000);
                      }
                    }}
                    step="1"
                    type="range"
                    value={layer.transparency}
                  />
                </div>
                <div>
                  <Button
                    circular
                    compact
                    disabled={idx === 0 || isFetching === true}
                    icon
                    onClick={() => {
                      moveUp(layer);
                    }}
                    size="mini">
                    <Icon name="arrow up" />
                  </Button>
                  <Button
                    circular
                    compact
                    disabled={idx === len || isFetching === true}
                    icon
                    onClick={() => {
                      moveDown(layer);
                    }}
                    size="mini">
                    <Icon name="arrow down" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

MapOverlayComponent.propTypes = {
  isFetching: PropTypes.bool,
  layers: PropTypes.object,
  moveDown: PropTypes.func,
  moveUp: PropTypes.func,
  saveTransparency: PropTypes.func,
  setSelectedLayer: PropTypes.func,
  setTransparency: PropTypes.func,
  toggleVisibility: PropTypes.func,
};

MapOverlayComponent.defaultProps = {};

export default MapOverlayComponent;
