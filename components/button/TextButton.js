import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  border: "1px solid",
  lineHeight: 1.5,
  color: "black",
  backgroundColor: "#FFB81C",
  borderColor: "#FFB81C",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#edac1c",
    borderColor: "#edac1c",
    boxShadow: "none",
    color: "white",
  },
});

export default function TextButton({
  fullWidth,
  maxWidth,
  handleClickOpen,
  handleClose,
  buttonOpen,
  buttonName,
  buttonTitle,
  buttonContentText,
  TextField,
  buttonYes,
  buttonNo,
  buttonYesFunction,
}) {
  return (
    <Box>
      <StyledButton variant="contained" onClick={handleClickOpen} disableRipple>
        {buttonName}
      </StyledButton>
      <Dialog
        open={buttonOpen}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle>{buttonTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "15px" }}>
            {buttonContentText}
          </DialogContentText>
          {TextField}
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={buttonYesFunction}
              style={{ color: "#e69d00", border: "#e69d00" }}
            >
              {buttonYes}
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              style={{ color: "#e69d00", border: "#e69d00" }}
            >
              {buttonNo}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
