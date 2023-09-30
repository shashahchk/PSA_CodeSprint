import "./App.css";
import PendingOrders from "./components/PendingOrders";
import LoginPage from "./LoginPage";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import IncomingShipments from "./components/IncomingShipments";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import OutgoingShipments from "./components/OutgoingShipments";

const theme = createTheme({
  palette: {
    primary: {
      main: "#74418c",
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/pending_orders" element={<PendingOrders />} />
          <Route path="/incoming_shipments" element={<IncomingShipments />} />
          <Route path="/outgoing_shipments" element={<OutgoingShipments />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
