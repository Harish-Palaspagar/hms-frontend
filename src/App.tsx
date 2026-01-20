import React from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/dropzone/styles.css";
import '@mantine/charts/styles.css';
import { Notifications } from "@mantine/notifications";
import AppRoutes from "./Routes/AppRoutes";
import { Provider } from "react-redux";
import Store from "./Store";
import { PrimeReactProvider } from "primereact/api";
import { ModalsProvider } from "@mantine/modals";

const theme = createTheme({
  focusRing: "never",
  fontFamily: "Poppins, sans-serif",
  headings: { fontFamily: "Ubuntu, sans-serif" },
  colors: {
    primary: [
      "#fef3f2",
      "#fee4e2",
      "#fecdd3",
      "#fda4af",
      "#fb7185",
      "#f43f5e",
      "#e11d48",
      "#be123c",
      "#9f1239",
      "#881337",
    ],
    neutral: [
      "#fafafa",
      "#f5f5f5",
      "#e5e5e5",
      "#d4d4d4",
      "#a3a3a3",
      "#737373",
      "#525252",
      "#404040",
      "#262626",
      "#171717",
      "#0a0a0a",
    ],
  },
  primaryColor: "primary",
  primaryShade: { light: 5, dark: 6 },
  defaultGradient: {
    from: "primary.4",
    to: "primary.7",
    deg: 145,
  },
});

const App = () => {
  return (
    <Provider store={Store}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <PrimeReactProvider>
            <Notifications position="top-center" />
            <AppRoutes />
          </PrimeReactProvider>
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
};

export default App;
