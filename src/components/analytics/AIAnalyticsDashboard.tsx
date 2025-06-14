
import { useState, useEffect } from "react";
import { patternRecognitionService, BehaviorPattern, AnalyticsMetrics } from "@/services/patternRecognitionService";
import { enhancedPatternService } from "@/services/enhancedPatternService";
import AIStatusHeader from "./AIStatusHeader";
import MLStatusCard from "./MLStatusCard";
import AIMetricsGrid from "./AIMetricsGrid";
import PatternDistributionChart from "./PatternDistributionChart";
import RiskTrendsChart from "./RiskTrendsChart";
import ConfidenceDistributionChart from "./ConfidenceDistributionChart";
import RecentDetectionsList from "./RecentDetectionsList";
import MLPerformanceMetrics from "./MLPerformanceMetrics";

const AIAnalyticsDashboard = () => {
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [mlStatus, setMLStatus] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = patternRecognitionService.subscribe(setPatterns);
    setMetrics(patternRecognitionService.getAnalyticsMetrics());
    
    // Initialize ML services
    const initializeML = async () => {
      try {
        await enhancedPatternService.initialize();
        const status = await enhancedPatternService.getMLModelStatus();
        setMLStatus(status);
      } catch (error) {
        console.error('Failed to initialize ML services:', error);
        setMLStatus({ initialized: false, error: error.message });
      }
    };

    initializeML();
    
    // Start pattern recognition if not already running
    patternRecognitionService.startPatternRecognition();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <AIStatusHeader mlStatus={mlStatus} />
      
      <MLStatusCard mlStatus={mlStatus} />

      <AIMetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatternDistributionChart patterns={patterns} />
        <RiskTrendsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceDistributionChart patterns={patterns} />
        <RecentDetectionsList patterns={patterns} />
      </div>

      <MLPerformanceMetrics metrics={metrics} />
    </div>
  );
};

export default AIAnalyticsDashboard;
