import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ComparisonDashboard from './pages/ComparisonDashboard';
import PricingComparison from './pages/PricingComparison';
import FeaturesMatrix from './pages/FeaturesMatrix';
import PerformanceMetrics from './pages/PerformanceMetrics';
import LatestNews from './pages/LatestNews';
import AgentProfile from './pages/AgentProfile';

function App() {
  return (
    <Router basename="/ai_agents">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comparison" element={<ComparisonDashboard />} />
          <Route path="/pricing" element={<PricingComparison />} />
          <Route path="/features" element={<FeaturesMatrix />} />
          <Route path="/performance" element={<PerformanceMetrics />} />
          <Route path="/news" element={<LatestNews />} />
          <Route path="/agent/:agentId" element={<AgentProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
