import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

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

export default function CustomButton({ onClick, buttonContent }) {
  return (
    <StyledButton variant="contained" onClick={onClick} disableRipple>
      {buttonContent}
    </StyledButton>
  );
}
