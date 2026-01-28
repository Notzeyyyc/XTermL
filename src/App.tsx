import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Setup from "@/pages/Setup";
import GeneralSetup from "@/pages/setup/General";
import ProotSetup from "@/pages/setup/Proot";
import Dashboard from "@/pages/Dashboard";
import Terminal from "@/pages/Terminal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/setup/general" element={<GeneralSetup />} />
        <Route path="/setup/proot" element={<ProotSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </Router>
  );
}

export default App;
