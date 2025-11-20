import NavBar from "./components/shared/NavBar";
import { ThemeProvider } from "./components/shared/Themeprovider";
import { Routes, Navigate, Route } from "react-router-dom";
import Login from "./components/shared/Login";
import Signup from "./components/shared/Signup";
import Home from "./components/shared/Home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
