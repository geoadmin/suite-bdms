import React, { useState, useEffect, useMemo, createRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import {
  useInstrumentationMutations,
  useInstrumentations,
} from "../../../../api/fetchApiV2";
import InstrumentationInput from "./instrumentationInput";
import InstrumentationDisplay from "./instrumentationDisplay";

const Instrumentation = ({ isEditable, completionId }) => {
  const { data: instrumentations, isSuccess } =
    useInstrumentations(completionId);
  const { t } = useTranslation();
  const {
    add: { mutate: addInstrumentation },
    update: { mutate: updateInstrumentation },
    delete: { mutate: deleteInstrumentation },
  } = useInstrumentationMutations();
  const [selectedInstrumentation, setSelectedInstrumentation] = useState(null);
  const [displayedInstrumentations, setDisplayedInstrumentations] = useState(
    [],
  );

  useEffect(() => {
    setDisplayedInstrumentations(instrumentations);
  }, [instrumentations]);

  // scroll to newly added item
  const instrumentationRefs = useMemo(
    () =>
      Array(displayedInstrumentations?.length)
        .fill(null)
        .map(() => createRef(null)),
    [displayedInstrumentations],
  );

  useEffect(() => {
    if (displayedInstrumentations?.length > 0) {
      const lastInstrumentationRef =
        instrumentationRefs[displayedInstrumentations?.length - 1];
      if (
        displayedInstrumentations[displayedInstrumentations?.length - 1].id ===
        0
      )
        lastInstrumentationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  }, [displayedInstrumentations, instrumentationRefs]);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Stack
          direction="row"
          sx={{ visibility: isEditable ? "visible" : "hidden" }}>
          <Typography sx={{ mr: 1 }}>{t("instrument")}</Typography>
          <Tooltip title={t("add")}>
            <AddCircleIcon
              data-cy="add-instrumentation-button"
              color={selectedInstrumentation === null ? "black" : "disabled"}
              onClick={e => {
                e.stopPropagation();
                if (!selectedInstrumentation) {
                  const tempInstrumentation = { id: 0 };
                  setDisplayedInstrumentations([
                    ...instrumentations,
                    tempInstrumentation,
                  ]);
                  setSelectedInstrumentation(tempInstrumentation);
                }
              }}
            />
          </Tooltip>
        </Stack>
      </Box>
      {displayedInstrumentations?.length === 0 && (
        <Stack alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
          <Typography variant="fullPageMessage">
            {t("msgInstrumentationEmpty")}
          </Typography>
        </Stack>
      )}
      <Grid
        container
        alignItems="stretch"
        columnSpacing={{ xs: 2 }}
        rowSpacing={{ xs: 2 }}
        sx={{ overflow: "auto", maxHeight: "85vh" }}>
        {displayedInstrumentations?.length > 0 &&
          displayedInstrumentations
            ?.sort((a, b) => a.fromDepthM - b.fromDepthM)
            .map((instrumentation, index) => {
              const isSelected =
                selectedInstrumentation?.id === instrumentation.id;
              const isTempInstrumentation = instrumentation.id === 0;
              return (
                <Grid
                  item
                  md={12}
                  lg={12}
                  xl={6}
                  key={instrumentation.id}
                  ref={instrumentationRefs[index]}>
                  {isSuccess ? (
                    isEditable && isSelected ? (
                      <InstrumentationInput
                        instrumentation={instrumentation}
                        setSelectedInstrumentation={setSelectedInstrumentation}
                        completionId={completionId}
                        updateInstrumentation={updateInstrumentation}
                        addInstrumentation={addInstrumentation}
                      />
                    ) : (
                      !isTempInstrumentation && (
                        <InstrumentationDisplay
                          instrumentation={instrumentation}
                          selectedInstrumentation={selectedInstrumentation}
                          setSelectedInstrumentation={
                            setSelectedInstrumentation
                          }
                          isEditable={isEditable}
                          deleteInstrumentation={deleteInstrumentation}
                        />
                      )
                    )
                  ) : (
                    <CircularProgress />
                  )}
                </Grid>
              );
            })}
      </Grid>
    </Stack>
  );
};
export default React.memo(Instrumentation);
