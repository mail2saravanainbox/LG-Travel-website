"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the browser print dialog so the user can save the confirmation as a PDF. */
export function PrintInvoiceButton() {
  return (
    <Button variant="primary" size="lg" onClick={() => window.print()}>
      <Download className="h-5 w-5" /> Download invoice
    </Button>
  );
}
