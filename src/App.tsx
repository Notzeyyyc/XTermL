import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Setup from "@/pages/Setup";
import GeneralSetup from "@/pages/setup/General";
import ProotSetup from "@/pages/setup/Proot";
import ChrootSetup from "@/pages/setup/Chroot";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/setup/general" element={<GeneralSetup />} />
        <Route path="/setup/proot" element={<ProotSetup />} />
        <Route path="/setup/chroot" element={<ChrootSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
