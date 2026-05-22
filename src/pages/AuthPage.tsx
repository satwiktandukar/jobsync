import Stack from "@mui/material/Stack";
import LoginContent from "../components/LoginContent";
import { Outlet } from "react-router";
import { Box } from "@mui/material";

export default function AuthPage() {
  return (
    <>
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "center",
            height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
            marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
            minHeight: "100%",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{
            width: "100%",
            maxWidth: 1100,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            sx={{
              width: "100%",
              maxWidth: 1100,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <LoginContent />

            <Box
              sx={{
                width: "100%",
                maxWidth: 450,
                minHeight: 520,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Outlet />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
