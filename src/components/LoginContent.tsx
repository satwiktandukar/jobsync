import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

const items = [
  {
    icon: <WorkspacesRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Centralized job tracking",
    description:
      "Manage all your applications in one place with a clean kanban-style workflow from wishlist to offer.",
  },
  {
    icon: <TrackChangesRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Focused application pipeline",
    description:
      "Track application stages, deadlines, interview progress, and next actions without losing momentum.",
  },
  {
    icon: <InsightsRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Organized career workflow",
    description:
      "Store notes, links, company details, and role-specific information to stay prepared during your job search.",
  },
  {
    icon: <AutoAwesomeRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Built for modern developers",
    description:
      "Designed with a fast, responsive interface focused on productivity, clarity, and rapid iteration.",
  },
];

export default function LoginContent() {
  return (
    <>
      <Stack
        sx={{
          flexDirection: "column",
          alignSelf: "center",
          gap: 4,
          maxWidth: 450,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src="/favicon.jpg"
          alt="JobSync logo"
          sx={{
            width: 50,
            height: 50,
            alignSelf: "center",
            borderRadius: 50,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.04em",
            mb: 1,
          }}
        >
          JobSync
        </Typography>
        {items.map((item, index) => (
          <Stack key={index} direction="row" sx={{ gap: 2 }}>
            {item.icon}

            <Box>
              <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                {item.title}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.description}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </>
  );
}
