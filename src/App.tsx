import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";
import PaymentGuide from "./pages/PaymentGuide";
import DemoResult from "./pages/DemoResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/docs" element={<PaymentGuide />} />
        <Route path="/demo/result" element={<DemoResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;