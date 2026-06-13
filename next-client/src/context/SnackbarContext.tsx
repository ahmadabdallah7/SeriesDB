"use client";

import { createContext, useContext, useState } from "react";

// Components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Types
type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

type SnackbarContextType = {
  showSnackbar: (message: string, severity: "success" | "error") => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  function showSnackbar(
    message: string,
    severity: "success" | "error" = "success",
  ) {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }));
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
