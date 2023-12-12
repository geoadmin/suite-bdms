import React from "react";
import * as Styled from "./styles";
import { Checkbox, Popup, Button, Icon } from "semantic-ui-react";
import TranslationText from "../../../../../translationText";
import { profileKind } from "../../../../constance";
import {
  copyStratigraphy,
  deleteStratigraphy,
} from "../../../../../../../api/fetchApiV2";

const InfoCheckBox = props => {
  const { kind, profileInfo, updateChange, isEditable, onUpdated } = props.data;

  return (
    <Styled.CheckBoxContainer>
      <Styled.FormContainer size="small">
        {kind !== profileKind.FILLING && (
          <>
            <Checkbox
              checked={profileInfo && profileInfo?.primary}
              label=""
              onChange={(ev, data) => {
                if (data.checked === true) {
                  updateChange("primary", data.checked, false);
                }
              }}
              toggle
            />
            {kind !== profileKind.CASING && (
              <TranslationText id="mainStratigraphy" />
            )}
            {kind === profileKind.CASING && (
              <TranslationText id="mainCompletion" />
            )}
          </>
        )}
      </Styled.FormContainer>
      {isEditable && (
        <div style={{ display: "flex" }} data-cy="clone-and-delete-buttons">
          <Button
            // disabled={!_.isEmpty(consistency)}
            icon
            onClick={() => {
              copyStratigraphy(profileInfo?.id).then(() => {
                onUpdated("cloneStratigraphy");
              });
            }}
            size="tiny">
            <Icon name="clone outline" />
          </Button>
          <Popup
            flowing
            hoverable
            on="click"
            position="right center"
            trigger={
              <Button icon size="tiny">
                <Icon name="trash alternate" />
              </Button>
            }>
            <TranslationText id="deleteForever" />?
            <br />
            <Button
              icon
              onClick={() => {
                deleteStratigraphy(profileInfo?.id).then(_ => {
                  onUpdated("deleteStratigraphy");
                });
              }}
              secondary
              size="tiny">
              <TranslationText id="yes" />
            </Button>
          </Popup>
        </div>
      )}
    </Styled.CheckBoxContainer>
  );
};

export default InfoCheckBox;
