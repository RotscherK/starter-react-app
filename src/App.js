import React, { useState, useEffect} from 'react'
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import {checkLoggedInStatus} from './services/AuthService'
import Layout from './views/Layout';
import Login from './views/Login';
import Register from './views/Register';
import UserSettings from './views/UserSettings';
import Home from './views/Home';
import Menu from './views/Menu';
import Product from './views/Product';
import WeekPlanner from './views/WeekPlanner';
import Sandbox from './views/Sandbox';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedInStatus);


  // Run checkLoggedInStatus on initial render
  useEffect(() => {
    setIsLoggedIn(checkLoggedInStatus());
  }, []);

  return (
      <Routes>
        <Route
          element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        >
          <Route index element={<Home />} />
          <Route
            path="/login"
            element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<Register isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/usersettings"
            element={<RequireAuth isLoggedIn={isLoggedIn}>
              <UserSettings />
            </RequireAuth>}
            isLoggedIn={isLoggedIn}
          />
          <Route
            path="/menu"
            element={<RequireAuth isLoggedIn={isLoggedIn}>
              <Menu />
            </RequireAuth>}
          />
          <Route
            path="/product"
            element={<RequireAuth isLoggedIn={isLoggedIn}>
              <Product />
            </RequireAuth>}
          />
          <Route
            path="/weekplanner"
            element={<RequireAuth isLoggedIn={isLoggedIn}>
              <WeekPlanner />
            </RequireAuth>}
            isLoggedIn={isLoggedIn}
          />
          <Route
            path="/sandbox"
            element={<Sandbox />}
            isLoggedIn={isLoggedIn}
          />
        </Route>
      </Routes>
  );
};

export default App;
