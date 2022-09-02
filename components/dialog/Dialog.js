import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
} from "@mui/material";

export default function AlertDialog({ buttonText, content }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        sx={{
          borderColor: "#FFB81C",
          color: "black",
          "&:hover": {
            backgroundColor: "#edac1c",
            borderColor: "#edac1c",
            boxShadow: "none",
            color: "white",
          },
        }}
        onClick={handleClickOpen}
      >
        {buttonText}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogContent>
          <Box
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "auto",
            }}
          >
            {content}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
