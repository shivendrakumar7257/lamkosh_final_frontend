import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";

export const Route = createFileRoute("/admin/products/new")({
  component: AdminNewProductPage,
});

function AdminNewProductPage() {
  return <ProductEditorForm />;
}
