import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Alert, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Link as RouterLink, useNavigate } from "react-router";

import type { UserCreate } from "../types/Job";
import { register } from "../services/application_service";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  borderRadius: "24px",

  backgroundColor: "rgba(255, 255, 255, 1.98)",
  // backdropFilter: "blur(2px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 24px 80px rgba(36, 28, 95, 0.24)",

  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },

  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(17, 15, 35, 0.78)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
  }),
}));

export default function RegisterPage() {
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  function handleSnackbarClose() {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!username.value || username.value.trim().length < 3) {
      setUsernameError(true);
      setUsernameErrorMessage("Username must be at least 3 characters long.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!name.value || name.value.trim().length < 2) {
      setNameError(true);
      setNameErrorMessage("Name must be at least 2 characters long.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = validateInputs();

    if (!isValid) return;

    const form = event.currentTarget;

    const data: UserCreate = {
      email: form.email.value,
      username: form.username.value,
      password: form.password.value,
      name: form.nickname.value,
    };

    try {
      await register(data);

      setSnackbar({
        open: true,
        message: "Account created. Redirecting to login...",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    } catch {
      setSnackbar({
        open: true,
        message: "User account with this email or username already exists.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Sign up
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>

            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="text"
              name="username"
              placeholder="user_name"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={usernameError ? "error" : "primary"}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>

            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              id="name"
              type="text"
              name="nickname"
              placeholder="John Doe"
              autoComplete="name"
              required
              fullWidth
              variant="outlined"
              color={nameError ? "error" : "primary"}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>

            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>

            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",

              backgroundColor: "hsl(265, 79%, 52%)",
              boxShadow: "0 10px 28px rgba(126, 34, 206, 0.28)",

              "&:hover": {
                backgroundColor: "hsl(265, 75%, 45%)",
                boxShadow: "0 12px 32px rgba(126, 34, 206, 0.34)",
              },
            }}
          >
            Sign up
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              color: "text.primary",
            }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/auth/login"
              variant="body2"
              sx={{
                color: "hsl(265, 79%, 45%)",
                fontWeight: 500,
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
