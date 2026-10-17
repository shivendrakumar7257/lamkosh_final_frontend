import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/jewellery")({
  component: () => <Navigate to="/clothing" replace />,
});
