import Stack from "@mui/material/Stack";
import LoginContent from "../components/LoginContent";
import { Outlet } from "react-router";

export default function AuthPage() {
  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      sx={(theme) => ({
        minHeight: "100dvh",
        px: 2,
        position: "relative",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          backgroundRepeat: "no-repeat",

          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
          }),
        },
      })}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          width: "100%",
          maxWidth: 1100,
        }}
      >
        <LoginContent />
        <Outlet />
      </Stack>
    </Stack>
  );
}
