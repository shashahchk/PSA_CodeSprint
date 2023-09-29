import logo from './logo.svg';
import './App.css';
import IncomingOrders from './components/IncomingOrders';
import LoginPage from './LoginPage';

function App() {
  return (
    <div className="App">
      <IncomingOrders />
      <LoginPage />
    </div>
  );
}

export default App;
