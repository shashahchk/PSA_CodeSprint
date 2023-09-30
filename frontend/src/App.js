import "./App.css";
import PendingOrders from "./components/PendingOrders";
import LoginPage from "./LoginPage";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import IncomingShipments from "./components/IncomingShipments";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import OutgoingShipments from "./components/OutgoingShipments";
import { createContext, useState } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#74418c",
      secondary: "#4b285c",
    },
  },
});

export const ShipmentsContext = createContext([]);

function App() {
  const [shipments, setShipments] = useState([]);

  return (
    <div className="App">
      <ShipmentsContext.Provider value={[shipments, setShipments]}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/pending_orders" element={<PendingOrders />} />
            <Route path="/incoming_shipments" element={<IncomingShipments />} />
            <Route path="/outgoing_shipments" element={<OutgoingShipments />} />
          </Routes>
        </ThemeProvider>
      </ShipmentsContext.Provider>
    </div>
  );
}

export default App;
