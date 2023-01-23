import "./App.css";
import Home from "./components/Pages/Home/Home/Home";
import Header from "./components/Shared/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FooterBottom from "./components/Shared/FooterBottom/FooterBottom";
import Login from "./components/Pages/Login/Login/Login";
import Register from "./components/Pages/Login/Register/Register";
import Policy from "./components/Pages/Policy/Policy";
import Help from "./components/Pages/Help/Help";
import AuthProvider from "./contexts/AuthProvider/AuthProvider";
// import StudentHome from "./components/Pages/Home/StudentHome/StudentHome";
import NotFound from "./components/Pages/Home/NotFound/NotFound";
import PrivateRoute from "./components/Pages/Login/PrivateRoute/PrivateRoute";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import StudentHome from "./components/Pages/Home/StudentHome/StudentHome";
import VoiceText from "./components/Pages/Home/VoiceText/VoiceText";
import DashboardAdmin from "./components/Pages/Dashboard/DashboardAdmin/DashboardAdmin";
import AdminRoute from "./components/Pages/Login/AdminRoute/AdminRoute";
import MakeAdmin from "./components/Pages/Dashboard/MakeAdmin/MakeAdmin";
import AddReviewer from "./components/Pages/Dashboard/AddReviewer/AddReviewer";
import DashboardHome from "./components/Pages/Dashboard/DashboardHome/DashboardHome";
import Reviewers from "./components/Pages/Home/Reviewers/Reviewers";
import Overview from "./components/Pages/Dashboard/Overview/Overview";
import ComplaintsList from "./components/Pages/Dashboard/ComplaintsList/ComplaintsList";
import ComplaintsListSingle from "./components/Pages/Dashboard/ComplaintsListSingle/ComplaintsListSingle";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>

            <Route path="/home" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/policy" element={<Policy />}></Route>
            <Route path="/help" element={<Help />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route path="/dashboardAdmin" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>}>

              <Route path={`/dashboardAdmin/makeAdmin`} element={<AdminRoute>
                <MakeAdmin></MakeAdmin>
              </AdminRoute>}>
              </Route>
              <Route path={`/dashboardAdmin/overview`} element={<AdminRoute>
                <Overview></Overview>
              </AdminRoute>}>
              </Route>
              <Route path={`/dashboardAdmin/ComplaintsListSingle/:complaintId`} element={<AdminRoute>
                <ComplaintsListSingle></ComplaintsListSingle>
              </AdminRoute>}>
              </Route>
              <Route path={`/dashboardAdmin/ComplaintsList`} element={<AdminRoute>
                <ComplaintsList></ComplaintsList>
              </AdminRoute>}>
              </Route>
              <Route path={`/dashboardAdmin/dashboardHome`} element={<PrivateRoute>
                <DashboardHome></DashboardHome>
              </PrivateRoute>}>
              </Route>
              <Route path={`/dashboardAdmin/addReviewer`} element={<AdminRoute>
                <AddReviewer></AddReviewer>
              </AdminRoute>}>
              </Route>

            </Route>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/studentHome" element={<PrivateRoute><StudentHome /></PrivateRoute>} />
            <Route path="/voice" element={<PrivateRoute><VoiceText /></PrivateRoute>} />
            <Route path="/reviewers" element={<PrivateRoute><Reviewers /></PrivateRoute>} />

            {/* <Route path={`/dashboardAdmin/makeAdmin`} element={<PrivateRoute>
              <MakeAdmin></MakeAdmin>
            </PrivateRoute>}>
            </Route>
            <Route path={`/dashboardAdmin/dashboardHome`} element={<PrivateRoute>
              <DashboardHome></DashboardHome>
            </PrivateRoute>}>
            </Route>
            <Route path={`/dashboardAdmin/addReviewer`} element={<PrivateRoute>
              <AddReviewer></AddReviewer>
            </PrivateRoute>}>
            </Route> */}


          </Routes>
          <FooterBottom />
        </BrowserRouter>
      </AuthProvider>
    </div >
  );
}

export default App;
