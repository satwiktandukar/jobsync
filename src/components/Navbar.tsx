import { AppBar, Container, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Navbar() {
  return (
    <AppBar
      sx={{
        height: "64px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Container sx={{ height: "100%" }}>
        <Button
          color="inherit"
          startIcon={<ArrowDropDownIcon />}
          sx={{ width: "200px", borderRadius: 12 }}
        >
          Software Engineering
        </Button>
        <Button
          color="inherit"
          startIcon={<ArrowDropDownIcon />}
          sx={{ width: "200px", borderRadius: 12, height: "100%" }}
        >
          Cybersecurity
        </Button>
      </Container>
    </AppBar>
  );
}
