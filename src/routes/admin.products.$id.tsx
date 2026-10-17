import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

export const Route = createFileRoute("/admin/products/$id")({
  component: AdminEditProductPage,
});

function AdminEditProductPage() {
  const { id } = Route.useParams();
  return <ProductEditorForm productId={id} />;
}
