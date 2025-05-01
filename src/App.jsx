import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Gallery from "./pages/Gallery";
import OfficialLinks from "./pages/OfficialLinks";
import HowToReach from "./pages/HowToReach";
import ContactUs from "./pages/ContactUs";
import ForgetPassword from "./pages/ForgetPassword";
import SuperUserDashboard from "./pages/SuperUserDashboard";
import Forbidden  from "./shared/Forbidden";
import ProtectedRoute from "./shared/ProtectedRoute";
import RegisterUser from "./pages/RegisterUser";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";
import UpdateUser from "./pages/UpdateUser";
import OfficialLinksPage from "./Links/OfficialLinksPage";
import AddNewLinks from "./Links/AddNewLInks";
import UpdateLinks from "./Links/UpdateLInks";
import GalleryMain from "./gallery/GalleryMain";
import TouristMain from "./tourist/TouristMain";
import TouristAdd from "./tourist/TouristAdd";
import TouristUpdate from "./tourist/TouristUpdate";
import ModifyImage from "./tourist/ModifyImage";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  const location = useLocation();

  // 🆕 Hide Navbar/Footer for specific paths
  const hideNavbarFooterPaths = ["/superUserDashboard", "/create-user", "/change-password","/update-user","/add-links", "/addNewLinks", "/update-profile",
   "/update-link/:id", "/adminDashboard","/add-image", "/add-tourist", "/add-touristSites", "/update-tourist/:id", "/modify-image" ];
  const hideNavbarFooter = hideNavbarFooterPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<Signup />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/official-links" element={<OfficialLinks />} />
          <Route path="/how-to-reach" element={<HowToReach />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          
          <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile/>
            </ProtectedRoute>
          }
          />

          <Route
          path="/modify-image"
          element={
            <ProtectedRoute>
              <ModifyImage/>
            </ProtectedRoute>
          }
          />
         
          <Route
          path="/update-tourist/:id"
          element={
            <ProtectedRoute>
              <TouristUpdate/>
            </ProtectedRoute>
          }
          />
          
          <Route
          path="/add-touristSites"
          element={
            <ProtectedRoute>
              <TouristAdd/>
            </ProtectedRoute>
          }
          />
          <Route
          path="/add-image"
          element={
            <ProtectedRoute>
              <GalleryMain/>
            </ProtectedRoute>
          }
          />
          <Route
           path="/add-tourist"
           element={ 
            <ProtectedRoute> 
            <TouristMain/>
            </ProtectedRoute>
           }
          />

          <Route 
             path="/update-link/:id"
             element={
              <ProtectedRoute>
                 <UpdateLinks />
              </ProtectedRoute>
             }
           />

          <Route
            path="/addNewLinks"
            element={
              <ProtectedRoute>
                <AddNewLinks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-links"
            element={
              <ProtectedRoute>
                <OfficialLinksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superUserDashboard"
            element={
              <ProtectedRoute>
                <SuperUserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute>
                <RegisterUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
          path="/update-user"
          element={
            <ProtectedRoute>
              <UpdateUser/>
            </ProtectedRoute>
          }
          />
          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </div>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
