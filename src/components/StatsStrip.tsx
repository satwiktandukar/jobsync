import { Box, Divider, Typography } from "@mui/material";
import type { Job } from "../types/Job";

const STAT_ITEMS = [
  { label: "Total", status: null as string | null, color: "#7c5cff" },
  { label: "Applied", status: "applied", color: "#3b82f6" },
  { label: "Interviewing", status: "interviewing", color: "#f59e0b" },
  { label: "Offers", status: "offers", color: "#10b981" },
  { label: "Rejected", status: "rejected", color: "#ef4444" },
];

export default function StatsStrip({ jobs }: { jobs: Job[] }) {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, md: 2.5 },
        flexWrap: "nowrap",
        px: 2,
        py: 0.75,
        borderRadius: "999px",
        backdropFilter: "blur(12px)",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.55)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.7)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 16px rgba(0,0,0,0.18)"
            : "0 4px 16px rgba(30,40,60,0.07)",
        flexShrink: 0,
      })}
    >
      {STAT_ITEMS.map(({ label, status, color }, idx) => {
        const count =
          status === null
            ? jobs.length
            : jobs.filter((j) => j.status === status).length;

        return (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: idx < STAT_ITEMS.length - 1 ? 0 : 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 36 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  fontWeight: 800,
                  color,
                  lineHeight: 1,
                }}
              >
                {count}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.58rem",
                  color: "text.secondary",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  mt: 0.25,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Typography>
            </Box>
            {idx < STAT_ITEMS.length - 1 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: { xs: 1, md: 1.5 }, opacity: 0.3, height: 28, alignSelf: "center" }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
