import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/Layout";
import Dashboard from "@/Pages/Dashboard";
import Upload from "@/Pages/Upload";
import Invoices from "@/Pages/Invoices";
import Documentation from "@/Pages/Documentation";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </Layout>
  );
}
