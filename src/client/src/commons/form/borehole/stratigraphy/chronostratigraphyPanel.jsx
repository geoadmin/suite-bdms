import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import NavigationContainer from "./navigationContainer";
import NavigationLens from "./navigationLens";
import LithologyViewProfile from "./lithologyViewProfile";
import LithostratigraphyViewProfile from "./lithostratigraphyViewProfile";
import ChronostratigraphyEditProfile from "./chronostratigraphyEditProfile";
import NavigationChild from "./navigationChild";
import Scale from "./scale";
import StratigraphySelection from "./stratigraphySelection";

const ChronostratigraphyPanel = ({ id: selectedBoreholeId, isEditable }) => {
  const { t } = useTranslation();

  return (
    <StratigraphySelection
      id={selectedBoreholeId}
      noStratigraphiesMessageKey={isEditable ? "msgChronostratigraphyEmptyEditing" : "msgChronostratigraphyEmpty"}
      renderItem={stratigraphyId => (
        <NavigationContainer
          sx={{ gap: "0.5em" }}
          renderItems={(navState, setNavState) => {
            return (
              <>
                <NavigationChild
                  moveChildren={false}
                  sx={{ flex: "0 0 4em" }}
                  navState={navState}
                  setNavState={setNavState}>
                  <NavigationLens
                    navState={navState}
                    setNavState={setNavState}
                    renderBackground={(lensNavState, setLensNavState) => (
                      <>
                        <LithostratigraphyViewProfile
                          navState={lensNavState}
                          setNavState={setLensNavState}
                          stratigraphyId={stratigraphyId}
                        />
                        <LithologyViewProfile
                          navState={lensNavState}
                          setNavState={setLensNavState}
                          stratigraphyId={stratigraphyId}
                          minPixelHeightForDepthLabel={Number.MAX_VALUE}
                        />
                      </>
                    )}
                  />
                </NavigationChild>
                <NavigationChild
                  sx={{ flex: "0 0 8em" }}
                  navState={navState}
                  setNavState={setNavState}
                  header={<Typography>{t("lithology")}</Typography>}>
                  <LithostratigraphyViewProfile
                    stratigraphyId={stratigraphyId}
                    navState={navState}
                    setNavState={setNavState}
                  />
                  <LithologyViewProfile stratigraphyId={stratigraphyId} navState={navState} setNavState={setNavState} />
                </NavigationChild>
                <NavigationChild
                  sx={{ flex: "0 0 4em" }}
                  navState={navState}
                  setNavState={setNavState}
                  header={<Typography>{t("depthMD")}</Typography>}>
                  <Scale navState={navState} />
                </NavigationChild>
                <ChronostratigraphyEditProfile
                  selectedStratigraphyID={stratigraphyId}
                  isEditable={isEditable}
                  navState={navState}
                  setNavState={setNavState}
                />
              </>
            );
          }}
        />
      )}
    />
  );
};

export default ChronostratigraphyPanel;
