import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import RequireAuth from "./middleware/RequireAuth";
import RestrictAuth from "./middleware/RestrictAuth";
import store, { useAppDispatch } from "./lib/srote";
import { Home, Login, Register } from "./pages";
import { fetchUserDetails } from "./features/auth/authSlice";
import { fetchBalance } from "./features/balanceSlice";
import { fetchServices } from "./features/serviceSlice";
import { fetchBanners } from "./features/bannerSlice";
import Main from "./components/Main";
import Profile from "./components/Profile";
import Topup from "./components/Topup";
import Payment from "./components/Payment";
import History from "./components/History";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(fetchUserDetails(token));
      dispatch(fetchBalance());
      dispatch(fetchServices());
      dispatch(fetchBanners());
    }
  }, [dispatch]);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <RestrictAuth header={<>Masuk atau buat akun untuk memulai</>}>
                <Login />
              </RestrictAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictAuth header={<>Masuk atau buat akun untuk memulai</>}>
                <Register />
              </RestrictAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Main>
                  <Home />
                </Main>
              </RequireAuth>
            }
          />
          <Route
            path="/topup"
            element={
              <RequireAuth>
                <Main>
                  <Topup />
                </Main>
              </RequireAuth>
            }
          />
          <Route
            path="/transaction"
            element={
              <RequireAuth>
                <Main>
                  <History />
                </Main>
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/services/:service_code"
            element={
              <RequireAuth>
                <Main>
                  <Payment />
                </Main>
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
