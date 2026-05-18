import { useDraggable } from "@dnd-kit/react";
import { Button } from "@mui/material";

function CategoryButton({
  category,
  selectedCategory,
  setSelectedCategory,
}: {
  category: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) {
  const { ref } = useDraggable({
    id: `category-${category}`,
    data: {
      type: "category",
      category,
    },
  });

  const selected = selectedCategory === category;

  return (
    <Button
      ref={ref}
      color="inherit"
      variant={selected ? "contained" : "text"}
      onClick={() => setSelectedCategory(category)}
      sx={(theme) => ({
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
      })}
    >
      {category}
    </Button>
  );
}
