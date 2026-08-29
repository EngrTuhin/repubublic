"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formConfig, formFieldsConfig } from "@/features/product-features/config";

export default function ProductFeaturesPage() {
  const state = useGlobal("v1/product-features");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formConfig={formConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}
