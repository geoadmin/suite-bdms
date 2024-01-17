import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Tooltip, Typography } from "@mui/material";
import {
  IconButtonWithMargin,
  TypographyWithBottomMargin,
  StackHalfWidth,
} from "./styledComponents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

const CompletionHeaderDisplay = props => {
  const {
    completion,
    isEditable,
    setEditing,
    copyCompletion,
    deleteCompletion,
  } = props;
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const toggleHeader = () => {
    setExpanded(!expanded);
  };

  const formattedDateTime = dateString => {
    const date = new Date(dateString);
    const dateTimeFormat = new Intl.DateTimeFormat("de-CH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    return dateTimeFormat.format(date);
  };

  return (
    <>
      <Stack
        data-cy="completion-header-display"
        direction="column"
        aria-expanded={expanded}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap">
          <StackHalfWidth direction="column" flex={"1 1 180px"}>
            <Typography variant="subtitle2">{t("name")}</Typography>
            <TypographyWithBottomMargin variant="subtitle1">
              {completion?.name || "-"}
            </TypographyWithBottomMargin>
          </StackHalfWidth>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flex={"0 0 400px"}>
            <StackHalfWidth direction="column" flex={"1 1 auto"}>
              <Typography variant="subtitle2">{t("completionKind")}</Typography>
              <TypographyWithBottomMargin variant="subtitle1">
                {completion.kind?.[i18n.language] || "-"}
              </TypographyWithBottomMargin>
            </StackHalfWidth>
            <StackHalfWidth direction="column">
              <Typography variant="subtitle2">{t("mainCompletion")}</Typography>
              <TypographyWithBottomMargin
                data-cy="completion-is-primary-value"
                variant="subtitle1"
                sx={{
                  display: "-webkit-box",
                  overflow: "auto",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}>
                {completion?.isPrimary ? t("yes") : t("no")}
              </TypographyWithBottomMargin>
            </StackHalfWidth>
          </Stack>
        </Stack>
        {expanded && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap">
              <StackHalfWidth direction="column">
                <Typography variant="subtitle2">{t("notes")}</Typography>
                <TypographyWithBottomMargin
                  variant="subtitle1"
                  sx={{
                    display: "-webkit-box",
                    overflow: "auto",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                  }}>
                  {completion?.notes || "-"}
                </TypographyWithBottomMargin>
              </StackHalfWidth>
              <StackHalfWidth direction="column" flex={"0 0 400px"}>
                <Typography variant="subtitle2">
                  {t("dateAbandonmentCasing")}
                </Typography>
                <TypographyWithBottomMargin variant="subtitle1">
                  {completion.abandonDate
                    ? formattedDateTime(completion.abandonDate)
                    : "-"}
                </TypographyWithBottomMargin>
              </StackHalfWidth>
            </Stack>
            <Stack
              direction="row"
              sx={{
                marginLeft: "auto",
                visibility: isEditable ? "visible" : "hidden",
              }}>
              <Tooltip title={t("edit")}>
                <IconButtonWithMargin
                  data-cy="edit-button"
                  onClick={e => {
                    e.stopPropagation();
                    setEditing(true);
                  }}>
                  <ModeEditIcon />
                </IconButtonWithMargin>
              </Tooltip>
              <Tooltip title={t("copy")}>
                <IconButtonWithMargin
                  data-cy="copy-button"
                  onClick={e => {
                    e.stopPropagation();
                    copyCompletion();
                  }}>
                  <CopyIcon />
                </IconButtonWithMargin>
              </Tooltip>
              <Tooltip title={t("delete")}>
                <IconButtonWithMargin
                  sx={{ color: "red !important", opacity: 0.9 }}
                  data-cy="delete-button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteCompletion();
                  }}>
                  <DeleteIcon />
                </IconButtonWithMargin>
              </Tooltip>
            </Stack>
          </>
        )}
        <IconButtonWithMargin
          onClick={toggleHeader}
          sx={{ paddingBottom: "0" }}
          data-cy="completion-toggle-header">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButtonWithMargin>
      </Stack>
    </>
  );
};
export default CompletionHeaderDisplay;