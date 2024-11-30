import Homes from "./pages/home/Homes";
import List from "./pages/listusers/List";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Single from "./pages/single/Single";
import UserPlans from "./pages/historique/UserPlans";
import New from "./pages/new/New";
import ListPlans from "./pages/listplans/ListPlans";
import Generate from "./pages/genererplan/Generate";
import Profile from "./pages/profile/Profile";
import EditUser from "./pages/edituser/EditUser";
import ProtectedRoute from './ProtectedRoute';
import EditProfile from "./pages/edituser/EditProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={[ 'user','admin']}>
                  <Generate />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="login" element={<Login />} />

          {/* Routes pour les utilisateurs */}
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <List />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <New title="Add New User" />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Routes pour les plans */}
          <Route path="plans">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ListPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <New />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Routes pour le profil */}
          <Route path="profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={[ 'admin']}><Homes /></ProtectedRoute>} />
          <Route path="historique" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserPlans /></ProtectedRoute>} />
          <Route path="edituser" element={<ProtectedRoute allowedRoles={['admin']}><EditUser title="Edit User" /></ProtectedRoute>} />
          <Route path="editprofile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><EditProfile title="Edit Profile" /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
