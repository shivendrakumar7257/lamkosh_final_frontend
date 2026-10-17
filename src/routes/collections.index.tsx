import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/")({
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/clothing", replace: true });
  }, [navigate]);

  return null;
}
