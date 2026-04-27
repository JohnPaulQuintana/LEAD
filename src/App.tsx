import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/layout/AppLayout";
import Details from "./pages/Details";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:placeId" element={<Details />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}