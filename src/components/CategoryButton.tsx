import { useDraggable } from "@dnd-kit/react";
import { Button } from "@mui/material";
import type { Category } from "../types/Job";

function CategoryButton({
  category,
  selectedCategory,
  setSelectedCategory,
}: {
  category: Category;
  selectedCategory: number | "All";
  setSelectedCategory: (category: number | "All") => void;
}) {
  const { ref } = useDraggable({
    id: `category-${category.id}`,
    data: {
      type: "category",
      category,
    },
  });

  const selected = selectedCategory === category.id;

  return (
    <Button
      ref={ref}
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
        WebkitBackdropFilter: "blur(12px)",

        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      {category.title}
    </Button>
  );
}

export default CategoryButton;
