import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, useAuthInterceptors } from "@/hooks/useAuth";
import { Login } from "@/pages/Login";
import { Categories } from "./pages/Categories";
import Layout from "./layout";
import { Products } from "./pages/Products";
import { Stock } from "./pages/Stock";
import { Movements } from "./pages/Movements";

function App() {
  const { isAuthenticated } = useAuth();

  useAuthInterceptors();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/movimenets" element={<Movements />} />
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="*" element={<Navigate to="/products" />} />
      </Route>
    </Routes>
  );
}

export default App;
