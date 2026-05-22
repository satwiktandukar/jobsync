import Stack from "@mui/material/Stack";
import LoginContent from "../components/LoginContent";
import { Navigate, Outlet } from "react-router";

export default function AuthPage() {
  //check if the user is logged in
  const token = localStorage.getItem("jwt-token");

  if (token) {
    return <Navigate to="/" replace />;
  }

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
            "radial-gradient(ellipse at 50% 50%, hsl(252, 37.90%, 46.10%), hsl(223, 21.40%, 83.50%))",
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
