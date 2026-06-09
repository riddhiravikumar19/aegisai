import { BrowserRouter, Routes, Route } from "react-router-dom";

import AegisHero from "./AegisAI_Hero";

import DashboardHome from "./pages/DashboardHome";
import PriorityPage from "./pages/PriorityPage";
import CostSavingsPage from "./pages/CostSavingsPage";
import RootCausePage from "./pages/RootCausePage";
import MachineHealthPage from "./pages/MachineHealthPage";
import CopilotPage from "./pages/CopilotPage";
import PredictionPage from "./pages/PredictionPage";
import AlertCenterPage from "./pages/AlertCenterPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import RULPage from "./pages/RULPage";
import DriftMonitoringPage from "./pages/DriftMonitoringPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ModelPerformancePage from "./pages/ModelPerformancePage";
function Protect({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AegisHero />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/dashboard" element={<Protect><DashboardHome /></Protect>} />
        <Route path="/priority" element={<Protect><PriorityPage /></Protect>} />
        <Route path="/cost-savings" element={<Protect><CostSavingsPage /></Protect>} />
        <Route path="/root-cause" element={<Protect><RootCausePage /></Protect>} />
        <Route path="/health" element={<Protect><MachineHealthPage /></Protect>} />
        <Route path="/copilot" element={<Protect><CopilotPage /></Protect>} />
        <Route path="/predict" element={<Protect><PredictionPage /></Protect>} />
        <Route path="/alerts" element={<Protect><AlertCenterPage /></Protect>} />
        <Route path="/live-monitoring" element={<Protect><LiveMonitoringPage /></Protect>} />
        <Route path="/rul" element={<Protect><RULPage /></Protect>} />
        <Route path="/drift" element={<Protect><DriftMonitoringPage /></Protect>} />
        <Route
  path="/model-performance"
  element={
    <Protect>
      <ModelPerformancePage />
    </Protect>
  }
/>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;