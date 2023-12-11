import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminHome from './pages/admin/AdminHome'
import Login from './pages/login/login';
import Layout from './components/Layout';
import FlightComponent from "./components/adminComponents/FlightComponent";
import AirportComponent from "./components/adminComponents/AirportComponent";
import FlightSchedulesComponent from "./components/adminComponents/FlightSchedulesComponent";
import UserHome from "./pages/user/UserHome";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admindashboard"
        element={
          <Layout>
            <AdminHome />
          </Layout>
        }
      />
      <Route
        path="/userhome"
        element={
          <Layout>
            <UserHome />
          </Layout>
        }
      />
    </Routes>
  </Router>
  )
}

export default App
