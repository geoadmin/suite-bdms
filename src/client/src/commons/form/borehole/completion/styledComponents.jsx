import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/system";
import { theme } from "../../../../AppTheme.js";

export const CompletionBox = styled(Box)(() => ({
  backgroundColor: theme.palette.secondary.background,
  borderRadius: "3px",
  padding: "10px 10px 5px 10px",
  margin: "0 5px 10px 5px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
}));

export const CompletionTabs = styled(Tabs)({
  margin: "0 4px",
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

export const CompletionTab = styled(props => <Tab disableRipple {...props} />)(() => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.secondary.background,
    borderRadius: "3px",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
