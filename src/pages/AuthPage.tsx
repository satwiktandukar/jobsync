import Stack from "@mui/material/Stack";
import LoginContent from "../components/LoginContent";
import { Navigate, Outlet } from "react-router";
import { Box } from "@mui/material";
import { useRef, useEffect } from "react";

function DynamicNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const particles = Array.from({ length: 500 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: Math.random() * 1.6 + 0.4,
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17, 0, 255, 2.9)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.35,
      }}
    />
  );
}

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
          backgroundColor: "transparent",
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
        <DynamicNetworkBackground />

        <LoginContent />
        <Outlet />
      </Stack>
    </Stack>
  );
}
