import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import * as Styled from "./styles";
import TranslationText from "../../../translationText";
import ProfileLayersValidation from "./components/profileLayersValidation";
import DescriptionLayers from "./components/descriptionLayers/descriptionLayers";
import { createLayerApi, getData } from "./api";
import {
  Box,
  CircularProgress,
  Stack,
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableRow,
  Tooltip,
  Typography,
  TableCell,
} from "@mui/material";
import {
  addLithologicalDescription,
  useLithoDescription,
  updateLithologicalDescription,
  deleteLithologicalDescription,
  useFaciesDescription,
  addFaciesDescription,
  updateFaciesDescription,
  deleteFaciesDescription,
} from "../../../../../api/fetchApiV2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { withTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { AlertContext } from "../../../../alert/alertContext";
import { profileKind } from "../../constance";

const ProfileLayers = props => {
  const {
    isEditable,
    selectedStratigraphyID,
    selectedLayer,
    setSelectedLayer,
    reloadLayer,
    onUpdated,
    stratigraphyKind,
  } = props.data;
  const { t } = props;
  const [layers, setLayers] = useState(null);
  const [selecteDescription, setSelectedDescription] = useState(null);
  const [showDelete, setShowDelete] = useState();
  const alertContext = useContext(AlertContext);
  const [deleteParams, setDeleteParams] = useState(null);

  const mounted = useRef(false);

  // React-query mutations and queries.
  const queryClient = useQueryClient();
  const lithoDescQuery = useLithoDescription(selectedStratigraphyID);
  const faciesDescQuery = useFaciesDescription(selectedStratigraphyID);

  const addLithologicalDescriptionMutation = useMutation(
    async params => {
      return await addLithologicalDescription(params);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lithoDesc"] });
      },
    },
  );

  const deleteLithologicalDescriptionMutation = useMutation(
    async id => {
      const result = await deleteLithologicalDescription(id);
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lithoDesc"] });
      },
    },
  );

  const updateLithologicalDescriptionMutation = useMutation(
    async params => {
      const result = await updateLithologicalDescription(params);
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lithoDesc"] });
      },
    },
  );

  const addFaciesDescriptionMutation = useMutation(
    async params => {
      return await addFaciesDescription(params);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["faciesDesc"] });
      },
    },
  );

  const deleteFaciesDescriptionMutation = useMutation(
    async id => {
      const result = await deleteFaciesDescription(id);
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["faciesDesc"] });
      },
    },
  );

  const updateFaciesDescriptionMutation = useMutation(
    async params => {
      const result = await updateFaciesDescription(params);
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["faciesDesc"] });
      },
    },
  );

  const setData = useCallback(stratigraphyID => {
    // Todo: use get layers from new api.
    getData(stratigraphyID).then(res => {
      if (mounted.current) {
        setLayers(res);
      }
    });
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (selectedStratigraphyID && mounted.current) {
      setData(selectedStratigraphyID);
    } else {
      setLayers(null);
    }
    return () => {
      mounted.current = false;
    };
  }, [selectedStratigraphyID, reloadLayer, setData]);

  const createNewLayer = () => {
    createLayerApi(selectedStratigraphyID).then(res => {
      if (res) {
        onUpdated("newLayer");
      }
    });
  };

  const setSelectedLayerFunc = item => {
    if (item === selectedLayer) {
      // unselect if layer is clicked again
      setSelectedLayer(null);
    } else {
      setSelectedLayer(item);
      setSelectedDescription(null);
    }
  };

  const addDescription = (query, mutation) => {
    if (
      query?.data &&
      query?.data?.length &&
      query?.data[query?.data?.length - 1]?.toDepth == null
    ) {
      alertContext.error(t("first_add_layer_to_depth"));
    } else {
      setSelectedDescription(null);
      const newFromDepth = query?.data?.at(-1)?.toDepth ?? 0;
      layers?.data?.length
        ? mutation.mutate({
            stratigraphyId: selectedStratigraphyID,
            fromDepth: newFromDepth,
            toDepth: layers?.data.find(l => l.depth_from === newFromDepth)
              ?.depth_to,
          })
        : alertContext.error(t("first_add_lithology"));
    }
  };

  const getColumnTitle = stratigraphyKind => {
    switch (stratigraphyKind) {
      case profileKind.STRATIGRAPHY:
        return <Typography>{t("lithology")}</Typography>;
      case profileKind.CASING:
        return <Typography>{t("add")}</Typography>;
      case profileKind.FILLING:
        return <Typography>{t("add")}</Typography>;
      default:
        <></>;
    }
  };

  const cellStyle = {
    verticalAlign: "top",
    padding: "0",
    width: "33%",
    minHeight: "10em",
  };

  return (
    <>
      {layers?.data && !lithoDescQuery.isLoading ? (
        <Styled.Container>
          <TableContainer
            sx={{
              minHeight: "10em",
              overflow: selectedLayer ? "hidden" : "",
              borderBottom: layers?.data?.length ? "1px solid lightgrey" : "",
            }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ zIndex: 0 }}>
                <TableRow>
                  <TableCell>
                    <Stack direction="row">
                      {getColumnTitle(stratigraphyKind)}
                      {isEditable && selectedStratigraphyID !== null && (
                        <Tooltip title={t("add")}>
                          <AddCircleIcon
                            sx={{ marginLeft: 1.5 }}
                            data-cy="add-layer-icon"
                            onClick={createNewLayer}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  {selectedLayer === null &&
                    stratigraphyKind === profileKind.STRATIGRAPHY && (
                      <TableCell>
                        <Stack direction="row">
                          <Typography>
                            {t("lithological_description")}
                          </Typography>
                          {isEditable && selectedStratigraphyID !== null && (
                            <Tooltip title={t("add")} sx={{}}>
                              <AddCircleIcon
                                sx={{ marginLeft: 1.5 }}
                                data-cy="add-litho-desc-icon"
                                onClick={() =>
                                  addDescription(
                                    lithoDescQuery,
                                    addLithologicalDescriptionMutation,
                                  )
                                }
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                  {selectedLayer === null &&
                    stratigraphyKind === profileKind.STRATIGRAPHY && (
                      <TableCell>
                        <Stack direction="row">
                          <Typography>{t("facies_description")}</Typography>
                          {isEditable && selectedStratigraphyID !== null && (
                            <Tooltip title={t("add")} sx={{}}>
                              <AddCircleIcon
                                sx={{ marginLeft: 1.5 }}
                                data-cy="add-facies-desc-icon"
                                onClick={() =>
                                  addDescription(
                                    faciesDescQuery,
                                    addFaciesDescriptionMutation,
                                  )
                                }
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <td style={cellStyle}>
                    {layers?.data?.length > 0 && (
                      <ProfileLayersValidation
                        data={{
                          layers,
                          isEditable,
                          onUpdated,
                          selectedLayer,
                          showDelete,
                          setShowDelete,
                          selectedStratigraphyID,
                          setSelectedLayer: setSelectedLayerFunc,
                        }}
                        setDeleteParams={setDeleteParams}
                      />
                    )}
                  </td>
                  {selectedLayer === null &&
                    stratigraphyKind === profileKind.STRATIGRAPHY &&
                    lithoDescQuery?.data?.length > 0 && (
                      <td style={cellStyle}>
                        <DescriptionLayers
                          isEditable={isEditable}
                          descriptions={lithoDescQuery?.data}
                          setSelectedDescription={setSelectedDescription}
                          selectedDescription={selecteDescription}
                          layers={layers}
                          addMutation={addLithologicalDescriptionMutation}
                          deleteMutation={deleteLithologicalDescriptionMutation}
                          updateMutation={updateLithologicalDescriptionMutation}
                          selectedStratigraphyID={selectedStratigraphyID}
                          deleteParams={deleteParams}
                        />
                      </td>
                    )}
                  {selectedLayer === null &&
                    stratigraphyKind === profileKind.STRATIGRAPHY &&
                    faciesDescQuery?.data?.length > 0 && (
                      <td style={cellStyle}>
                        <DescriptionLayers
                          isEditable={isEditable}
                          descriptions={faciesDescQuery?.data}
                          setSelectedDescription={setSelectedDescription}
                          selectedDescription={selecteDescription}
                          layers={layers}
                          addMutation={addFaciesDescriptionMutation}
                          deleteMutation={deleteFaciesDescriptionMutation}
                          updateMutation={updateFaciesDescriptionMutation}
                          selectedStratigraphyID={selectedStratigraphyID}
                          deleteParams={deleteParams}
                        />
                      </td>
                    )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {layers?.data?.length === 0 && (
            <Styled.Empty>
              <TranslationText id="nothingToShow" />
            </Styled.Empty>
          )}
        </Styled.Container>
      ) : (
        <Box display="flex" justifyContent="center" pt={5}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default withTranslation()(ProfileLayers);
