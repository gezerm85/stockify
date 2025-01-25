import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { store } from "./redux/store";
import { Provider } from "react-redux";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#0056b3",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </Provider>
);
