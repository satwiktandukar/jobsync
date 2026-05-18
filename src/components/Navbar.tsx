import { AppBar, Container, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type NavbarProps = {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onAddCategory: () => void;
};

export default function Navbar({
  mode,
  setMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddCategory,
}: NavbarProps) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      sx={(theme) => ({
        color:
          theme.palette.mode === "dark"
            ? theme.palette.common.white
            : theme.palette.common.black,
        height: "64px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[200],
      })}
    >
      <Container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
        }}
      >
        <Button
          color="inherit"
          variant={selectedCategory === "All" ? "contained" : "text"}
          onClick={() => setSelectedCategory("All")}
          sx={{ minWidth: "120px", borderRadius: 12, height: "100%" }}
        >
          All
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            color="inherit"
            variant={selectedCategory === category ? "contained" : "text"}
            onClick={() => setSelectedCategory(category)}
            sx={{ minWidth: "200px", borderRadius: 12, height: "100%" }}
          >
            {category}
          </Button>
        ))}

        <Button
          color="inherit"
          startIcon={<AddIcon />}
          onClick={onAddCategory}
          sx={{ minWidth: "160px", borderRadius: 12, height: "80%" }}
        >
          Add Category
        </Button>

        <IconButton
          color="inherit"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          aria-label={
            mode === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          sx={{ ml: "auto" }}
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Container>
    </AppBar>
  );
}
