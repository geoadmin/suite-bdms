import { useState, useEffect, useCallback } from "react";
import * as Styled from "./styles";
import { useSelector } from "react-redux";
import ProfileHeader from "./components/profileHeader";
import ProfileInfo from "./components/profileInfo";
import ProfileLayers from "./components/profileLayers";
import ProfileAttributes from "./components/profileAttributes";
import { stratigraphyData } from "./data/stratigraphydata";
import TranslationText from "../translationText";
import { Loader } from "semantic-ui-react";

const Profile = () => {
  const { user, borehole } = useSelector(state => ({
    borehole: state.core_borehole,
    user: state.core_user,
  }));

  const [isEditable, setIsEditable] = useState(false);
  const [selectedStratigraphy, setSelectedStratigraphy] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [reloadLayer, setReloadLayer] = useState(0);
  const [reloadHeader, setReloadHeader] = useState(0);
  const [reloadAttribute, setReloadAttribute] = useState(0);
  const [attributesBasedKind, setAttributesBasedKind] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const onUpdated = attribute => {
    if (attribute === "toDepth" || attribute === "fromDepth" || attribute === "lithology" || attribute === "newLayer") {
      setReloadLayer(reloadLayer => reloadLayer + 1);
    }

    if (attribute === "deleteLayer" || attribute === "fixErrors") {
      setSelectedLayer(null);
      setReloadLayer(reloadLayer => reloadLayer + 1);
    }

    if (
      attribute === "isPrimary" ||
      attribute === "name" ||
      attribute === "quality" ||
      attribute === "date" ||
      attribute === "cloneStratigraphy"
    )
      setReloadHeader(reloadHeader => reloadHeader + 1);

    if (attribute === "deleteStratigraphy" || attribute === "newAttribute") {
      setSelectedStratigraphy(null);
      setReloadHeader(reloadHeader => reloadHeader + 1);
      setReloadLayer(reloadLayer => reloadLayer + 1);
    }

    if (attribute === "newAttribute") setReloadAttribute(reloadAttribute => reloadAttribute + 1);
  };

  useEffect(() => {
    if (
      !(borehole?.data?.lock === null || borehole?.data?.lock.id !== user?.data?.id || borehole?.data?.role !== "EDIT")
    ) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
    setAttributesBasedKind(stratigraphyData);
    onUpdated("newAttribute");
  }, [setIsEditable, borehole, user]);

  const set = useCallback(
    e => {
      setSelectedStratigraphy(e);
      setSelectedLayer(null);
    },
    [setSelectedStratigraphy, setSelectedLayer],
  );

  const setSelectedStratigraphyNull = useCallback(() => {
    setSelectedStratigraphy(null);
  }, []);

  return (
    <Styled.MainContainer>
      {borehole.data.id && (
        <ProfileHeader
          boreholeID={borehole.data.id}
          isEditable={isEditable}
          reloadHeader={reloadHeader}
          selectedStratigraphy={selectedStratigraphy}
          setSelectedStratigraphy={set}
          setSelectedStratigraphyNull={setSelectedStratigraphyNull}
          setIsLoadingData={setIsLoadingData}
        />
      )}

      {isLoadingData && <Loader active />}

      {!isLoadingData && !selectedStratigraphy && (
        <Styled.Empty data-cy="stratigraphy-message">
          <TranslationText id={borehole.data.lock ? "msgAddStratigraphy" : "msgStratigraphyEmpty"} />
        </Styled.Empty>
      )}

      {!isLoadingData && selectedStratigraphy && (
        <Styled.Container>
          <Styled.FirstColumn>
            <ProfileInfo
              data={{
                selectedStratigraphyID: selectedStratigraphy ? selectedStratigraphy.id : null,
                isEditable,
                onUpdated,
                attribute: attributesBasedKind?.profileInfo,
              }}
            />
            <ProfileLayers
              data={{
                selectedStratigraphyID: selectedStratigraphy ? selectedStratigraphy.id : null,
                isEditable,
                selectedLayer,
                setSelectedLayer: e => {
                  setSelectedLayer(e);
                },
                reloadLayer,
                onUpdated,
              }}
            />
          </Styled.FirstColumn>
          {selectedLayer !== null && (
            <Styled.SecondColumn>
              <ProfileAttributes
                data={{
                  id: selectedLayer ? selectedLayer.id : null,
                  selectedStratigraphyID: selectedStratigraphy?.id,
                  isEditable,
                  onUpdated,
                  reloadAttribute,
                  attribute: attributesBasedKind?.profileAttribute,
                }}
              />
            </Styled.SecondColumn>
          )}
        </Styled.Container>
      )}
    </Styled.MainContainer>
  );
};

export default Profile;
