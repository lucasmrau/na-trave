import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { PageNotFound } from "./pages/PageNotFound";
import { Profile } from "./pages/Profile";
import { SignUp } from "./pages/SignUp";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}