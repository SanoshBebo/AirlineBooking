import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminHome from './pages/admin/AdminHome'
import Login from './pages/login/login';
import Layout from './components/Layout';
import FlightComponent from "./components/adminComponents/FlightComponent";
import AirportComponent from "./components/adminComponents/AirportComponent";
import FlightSchedulesComponent from "./components/adminComponents/FlightSchedulesComponent";
import UserHome from "./pages/user/UserHome";
import FlightBooking from "./pages/user/FlightBooking";
import ConfirmBooking from "./pages/user/ConfirmBooking";
import RoundTripBooking from "./pages/user/RoundTripBooking";
import BookingHistory from "./pages/user/BookingHistory";
import NoPage from "./pages/user/NoPage";

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
      <Route
        path="/FlightBookingDetail/:mode"
        element={
          <Layout>
            <FlightBooking />
          </Layout>
        }
      />
      <Route
        path="/FlightBooking/ConfirmBooking"
        element={
          <Layout>
            <ConfirmBooking />
          </Layout>
        }
      />
      <Route
        path="/RoundTripBookingDetail"
        element={
          <Layout>
            <RoundTripBooking />
          </Layout>
        }
      />
      <Route
        path="/BookingHistory"
        element={
          <Layout>
            <BookingHistory />
          </Layout>
        }
      />
      <Route path="/*" element={<NoPage />} />
    </Routes>
  </Router>
  )
}

export default App
