import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";

import type { Category, User } from "../types/Job";
import { deepOrange } from "@mui/material/colors";
import { logout } from "../services/application_service";

const DELETE_CATEGORY_ID = "delete-category";

type NavbarProps = {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  categories: Category[];
  selectedCategory: number | "All";
  setSelectedCategory: (category: number | "All") => void;
  onAddCategory: () => void;
  onReorderCategories: (categories: Category[]) => void;
  onDeleteCategory: (category: Category) => void;
  user: User | null;
};

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const copy = [...items];
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

function CategoryButton({
  category,
  selectedCategory,
  setSelectedCategory,
}: {
  category: Category;
  selectedCategory: number | "All";
  setSelectedCategory: (category: number | "All") => void;
}) {
  const { ref: draggableRef } = useDraggable({
    id: `category-${category.id}`,
    data: {
      category,
    },
  });

  const { ref: droppableRef } = useDroppable({
    id: `category-${category.id}`,
    data: {
      category,
    },
  });

  const selected = selectedCategory === category.id;

  return (
    <Button
      ref={(node) => {
        draggableRef(node);
        droppableRef(node);
      }}
      color="inherit"
      variant={selected ? "contained" : "text"}
      onClick={() => setSelectedCategory(category.id)}
      sx={{
        minWidth: "180px",
        maxWidth: "220px",
        height: "48px",
        borderRadius: "999px",
        flexShrink: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "grab",
        fontWeight: 700,
        touchAction: "none",
        backdropFilter: "blur(12px)",
        color: "text.primary",
      }}
    >
      {category.title}
    </Button>
  );
}

function DeleteCategoryDropZone() {
  const { ref } = useDroppable({
    id: DELETE_CATEGORY_ID,
  });

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        position: "fixed",
        left: "50%",
        bottom: 4,
        transform: "translateX(-50%)",
        zIndex: 3000,
        px: 4,
        py: 2,
        borderRadius: "999px",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,80,80,0.55)",
        background: "rgba(255,80,80,0.22)",
        color: "#ffffff",
        fontWeight: 700,
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}
    >
      Drop here to delete
    </Paper>
  );
}

export default function Navbar({
  mode,
  setMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddCategory,
  onReorderCategories,
  onDeleteCategory,
  user,
}: NavbarProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  function handleDragStart(event: any) {
    const category = event.operation.source?.data?.category as
      | Category
      | undefined;

    if (!category) return;

    setActiveCategory(category);
  }

  function handleDragEnd(event: any) {
    if (event.canceled) {
      setActiveCategory(null);
      return;
    }

    const sourceCategory = event.operation.source?.data?.category as
      | Category
      | undefined;

    const targetId = event.operation.target?.id as string | undefined;

    setActiveCategory(null);

    if (!sourceCategory || !targetId) return;

    if (targetId === DELETE_CATEGORY_ID) {
      const shouldDelete = window.confirm(
        `Delete category "${sourceCategory.title}"?`,
      );

      if (shouldDelete) {
        onDeleteCategory(sourceCategory);
      }

      return;
    }

    if (!targetId.startsWith("category-")) return;

    const targetCategoryId = Number(targetId.replace("category-", ""));

    if (sourceCategory.id === targetCategoryId) return;

    const oldIndex = categories.findIndex((c) => c.id === sourceCategory.id);
    const newIndex = categories.findIndex((c) => c.id === targetCategoryId);

    if (oldIndex === -1 || newIndex === -1) return;

    onReorderCategories(moveItem(categories, oldIndex, newIndex));
  }

  const allSelected = selectedCategory === "All";

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <AppBar
        elevation={0}
        sx={(theme) => ({
          height: "72px",
          display: "flex",
          justifyContent: "center",
          background:
            theme.palette.mode === "dark"
              ? `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.08),
                rgba(255,255,255,0.03)
              )
            `
              : `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.75),
                rgba(255,255,255,0.45)
              )
            `,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          overflow: "visible",
        })}
      >
        <Container
          maxWidth={false}
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
          }}
        >
          <Box
            sx={{
              height: "100%",
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Button
              color="inherit"
              variant={allSelected ? "contained" : "text"}
              onClick={() => setSelectedCategory("All")}
              sx={{
                minWidth: "120px",
                height: "48px",
                borderRadius: "999px",
                flexShrink: 0,
                fontWeight: 700,
                backdropFilter: "blur(12px)",
                color: "text.primary",
              }}
            >
              All
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                height: "100%",
                flexShrink: 0,
              }}
            >
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              ))}
            </Box>

            <DragOverlay>
              {activeCategory ? (
                <Button
                  color="inherit"
                  variant="contained"
                  sx={{
                    minWidth: "180px",
                    maxWidth: "220px",
                    height: "48px",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                    cursor: "grabbing",
                    backdropFilter: "blur(18px)",
                    background: "rgba(124,92,255,0.32)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    pointerEvents: "none",
                  }}
                >
                  {activeCategory.title}
                </Button>
              ) : null}
            </DragOverlay>
          </Box>

          <Box
            sx={{
              height: "100%",
              width: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1.2,
              flexShrink: 0,
            }}
          >
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={onAddCategory}
              sx={(theme) => ({
                minWidth: "170px",
                height: "48px",
                borderRadius: "999px",
                fontWeight: 700,
                backdropFilter: "blur(12px)",
                color: "text.primary",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.45)",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(255,255,255,0.65)",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              })}
            >
              Add Category
            </Button>

            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              aria-label={
                mode === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              sx={(theme) => ({
                width: 48,
                height: 48,
                color: "text.primary",
                backdropFilter: "blur(12px)",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.45)",
              })}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <PopupState variant="popover" popupId="user_menu">
              {(popupState) => {
                return (
                  <>
                    {" "}
                    <Avatar
                      sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
                      {...bindTrigger(popupState)}
                    >
                      {user?.name[0].toUpperCase()}
                    </Avatar>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={popupState.close}>Profile</MenuItem>
                      <MenuItem onClick={popupState.close}>My account</MenuItem>
                      <MenuItem
                        onClick={() => {
                          popupState.close();
                          logout();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                );
              }}
            </PopupState>
          </Box>
        </Container>
      </AppBar>

      {activeCategory && <DeleteCategoryDropZone />}
    </DragDropProvider>
  );
}
