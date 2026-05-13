import { AppBar, Container, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Navbar({ mode, setMode }: { mode: "light" | "dark", setMode: (mode: "light" | "dark") => void }) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      sx={(theme)=>{return {
        color: theme.palette.mode ==="dark"? theme.palette.common.white : theme.palette.common.black,
        height: "64px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200],
      }}}
    >
      <Container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
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
        <IconButton
          color="inherit"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
          sx={{ ml: "auto" }}
          
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Container>
    </AppBar>
  );
}
