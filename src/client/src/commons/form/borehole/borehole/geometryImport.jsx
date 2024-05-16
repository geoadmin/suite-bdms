import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { FileDropzone } from "../../../../commons/files/fileDropzone";
import { AddButton } from "../../../../components/buttons/buttons";
import {
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material/";
import {
  useBoreholeGeometry,
  useBoreholeGeometryMutations,
  getBoreholeGeometryFormats,
} from "../../../../api/fetchApiV2";
import { FormProvider, useForm, Controller, useWatch } from "react-hook-form";
import { FormSelect } from "../../../../components/form/form";
import { DevTool } from "@hookform/devtools";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AlertContext } from "../../../../components/alert/alertContext";
import { StackHalfWidth } from "../../../../components/baseComponents.js";

const GeometryImport = ({ boreholeId }) => {
  const { t } = useTranslation();
  const { error } = useContext(AlertContext);

  const {
    set: { mutate: setBoreholeGeometry },
  } = useBoreholeGeometryMutations();
  const { data } = useBoreholeGeometry(boreholeId);
  const [geometryFormats, setGeometryFormats] = useState([]);

  useEffect(() => {
    getBoreholeGeometryFormats().then(setGeometryFormats);
  }, []);

  const formMethods = useForm({
    defaultValues: { geometryFormat: "", geometryFile: [] },
  });

  useEffect(() => {
    formMethods.setValue("geometryFormat", geometryFormats?.at(0)?.key);
  }, [geometryFormats, formMethods]);

  const uploadGeometryCSV = data => {
    let formData = new FormData();
    formData.append("geometryFile", data.geometryFile[0]);
    formData.append("geometryFormat", data.geometryFormat);
    setBoreholeGeometry(
      { boreholeId, formData },
      {
        onSuccess: async data => {
          // fetch does not fail promises on 4xx or 5xx responses
          // ¯\_(ツ)_/¯
          if (!data.ok) {
            data.json().then(msg => error(msg.detail ?? t("errorDuringBoreholeFileUpload")));
          }
        },
      },
    );
  };

  const watch = useWatch({ control: formMethods.control });
  const expectedCSVHeader =
    geometryFormats?.find(f => f.key === formMethods.getValues("geometryFormat"))?.csvHeader ?? "";

  return (
    <>
      <Card>
        <CardContent>
          <DevTool control={formMethods.control} placement="top-left" />
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(uploadGeometryCSV)}>
              <Stack direction="row" alignItems="flex-start">
                <StackHalfWidth spacing={2}>
                  <FormSelect
                    fieldName="geometryFormat"
                    label="boreholeGeometryFormat"
                    values={geometryFormats}
                    required={true}
                  />
                  {expectedCSVHeader !== "" && (
                    <>
                      <Typography>{t("csvFormatExplanation")}</Typography>
                      <TextField
                        value={expectedCSVHeader}
                        size="small"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title={t("copyToClipboard")}>
                                <IconButton onClick={() => navigator.clipboard.writeText(expectedCSVHeader)}>
                                  <ContentCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </>
                  )}
                </StackHalfWidth>
                <Controller
                  name="geometryFile"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FileDropzone
                      onHandleFileChange={field.onChange}
                      defaultText={"dropZoneGeometryText"}
                      restrictAcceptedFileTypeToCsv={true}
                      maxFilesToSelectAtOnce={1}
                      maxFilesToUpload={1}
                      isDisabled={false}
                      dataCy={"import-geometry-input"}
                    />
                  )}
                />
              </Stack>
            </form>
          </FormProvider>
        </CardContent>
        <CardActions>
          <AddButton
            sx={{ marginLeft: "auto" }}
            label={data?.length > 0 ? "boreholeGeometryReplace" : "boreholeGeometryImport"}
            onClick={formMethods.handleSubmit(uploadGeometryCSV)}
            disabled={watch?.geometryFile?.length === 0}
          />
        </CardActions>
      </Card>
    </>
  );
};

export default GeometryImport;