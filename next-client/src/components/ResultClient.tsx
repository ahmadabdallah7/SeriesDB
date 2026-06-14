"use client";

import { useEffect } from "react";

// Context
import { useSnackbar } from "@/context/SnackbarContext";

// Types
type Props = {
  error: string | null;
  children: React.ReactNode;
};

export default function ResultClient({ error, children }: Props) {
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error]);

  return <>{children}</>;
}
