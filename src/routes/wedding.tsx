import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/wedding")({
  component: () => <Navigate to="/" replace />,
});
