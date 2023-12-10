import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminHome from './pages/admin/AdminHome'
import Login from './pages/login/login';
import Layout from './components/Layout';
import FlightComponent from "./components/adminComponents/FlightComponent";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin-page"
        element={
          <Layout>
            <FlightComponent />
          </Layout>
        }
      />
    </Routes>
  </Router>
  )
}

export default App
