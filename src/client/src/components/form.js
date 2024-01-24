import {
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";

export const getInputFieldBackgroundColor = errorFieldName =>
  Boolean(errorFieldName) ? "#fff6f6" : "transparent";

export const FormInput = props => {
  const {
    fieldName,
    label,
    required,
    disabled,
    type,
    multiline,
    rows,
    value,
    sx,
  } = props;
  const { t } = useTranslation();
  const { formState, register, trigger } = useFormContext();

  return (
    <TextField
      name={fieldName}
      required={required || false}
      sx={{
        backgroundColor: getInputFieldBackgroundColor(
          formState.errors[fieldName],
        ),
        borderRadius: "4px",
        flex: "1",
        marginTop: "10px !important",
        marginRight: "10px !important",
        ...sx,
      }}
      type={type || "text"}
      multiline={multiline || false}
      rows={multiline ? rows || 3 : 1}
      size="small"
      label={t(label)}
      variant="outlined"
      error={!!formState.errors[fieldName]}
      {...register(fieldName, {
        required: required || false,
        valueAsNumber: type === "number" ? true : false,
        onChange: e => trigger(fieldName),
      })}
      defaultValue={value != null ? value : ""}
      disabled={disabled || false}
      data-cy={fieldName + "-formInput"}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export const FormSelect = props => {
  const { fieldName, label, required, disabled, selected, sx } = props;
  const { t } = useTranslation();
  const { control, formState, register, trigger } = useFormContext();

  return (
    <FormControl
      variant="outlined"
      sx={{ marginRight: "10px", flex: "1" }}
      required>
      <Controller
        name={fieldName}
        control={control}
        defaultValue={selected || ""}
        render={({ field }) => (
          <TextField
            {...field}
            select
            required={required || false}
            size="small"
            label={t(label)}
            variant="outlined"
            value={field.value || ""}
            disabled={disabled || false}
            data-cy={fieldName + "-formSelect"}
            error={Boolean(formState.errors[fieldName])}
            {...register(fieldName, {
              required: required || false,
              onChange: e => trigger(fieldName),
            })}
            InputLabelProps={{ shrink: true }}
            sx={{
              backgroundColor: getInputFieldBackgroundColor(
                formState.errors[fieldName],
              ),
              borderRadius: "4px",
              marginTop: "10px",
              ...sx,
            }}>
            {props.children}
          </TextField>
        )}
      />
    </FormControl>
  );
};

export const FormCheckbox = props => {
  const { fieldName, label, checked, disabled, sx } = props;
  const { t } = useTranslation();
  const { register, trigger } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Checkbox
          data-cy={fieldName + "-formCheckbox"}
          {...register(fieldName, {
            onChange: e => trigger(fieldName),
          })}
          disabled={disabled || false}
          defaultChecked={checked || false}
        />
      }
      label={t(label)}
      sx={{ ...sx }}
    />
  );
};
