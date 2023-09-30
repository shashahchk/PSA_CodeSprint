import logo from "./logo.svg";
import "./App.css";
import IncomingOrders from "./components/IncomingOrders";
import LoginPage from "./LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/incoming_orders" element={<IncomingOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
