
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { alertsService, Alert } from '@/services/alertsService';

interface ReportConfig {
  dateRange: {
    from: Date;
    to: Date;
  };
  severity: string;
  type: string;
  status: string;
  format: 'json' | 'csv' | 'pdf';
}

const ReportsManager: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      to: new Date()
    },
    severity: 'all',
    type: 'all',
    status: 'all',
    format: 'json'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Get filtered alerts based on report config
      const filters: any = {};
      if (reportConfig.severity !== 'all') filters.severity = reportConfig.severity;
      if (reportConfig.type !== 'all') filters.type = reportConfig.type;
      if (reportConfig.status !== 'all') filters.status = reportConfig.status;
      
      const alerts = alertsService.getAlerts(filters);
      
      // Filter by date range
      const filteredAlerts = alerts.filter(alert => {
        const alertDate = new Date(alert.timestamp);
        return alertDate >= reportConfig.dateRange.from && alertDate <= reportConfig.dateRange.to;
      });

      // Generate report based on format
      switch (reportConfig.format) {
        case 'json':
          exportAsJSON(filteredAlerts);
          break;
        case 'csv':
          exportAsCSV(filteredAlerts);
          break;
        case 'pdf':
          exportAsPDF(filteredAlerts);
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAsJSON = (alerts: Alert[]) => {
    const reportData = {
      generated: new Date().toISOString(),
      dateRange: reportConfig.dateRange,
      filters: {
        severity: reportConfig.severity,
        type: reportConfig.type,
        status: reportConfig.status
      },
      summary: {
        totalAlerts: alerts.length,
        bySeverity: {
          critical: alerts.filter(a => a.severity === 'critical').length,
          high: alerts.filter(a => a.severity === 'high').length,
          medium: alerts.filter(a => a.severity === 'medium').length,
          low: alerts.filter(a => a.severity === 'low').length
        },
        byStatus: {
          new: alerts.filter(a => a.status === 'new').length,
          acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
          investigating: alerts.filter(a => a.status === 'investigating').length,
          escalated: alerts.filter(a => a.status === 'escalated').length,
          resolved: alerts.filter(a => a.status === 'resolved').length
        }
      },
      alerts
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `maritime-alerts-report-${format(new Date(), 'yyyy-MM-dd')}.json`);
  };

  const exportAsCSV = (alerts: Alert[]) => {
    const headers = ['ID', 'Type', 'Severity', 'Title', 'Description', 'Location', 'Status', 'Assignee', 'Source', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...alerts.map(alert => [
        alert.id,
        alert.type,
        alert.severity,
        `"${alert.title.replace(/"/g, '""')}"`,
        `"${alert.description.replace(/"/g, '""')}"`,
        alert.location ? `"${alert.location.name || `${alert.location.lat}, ${alert.location.lng}`}"` : '',
        alert.status,
        alert.assignee || '',
        alert.source,
        alert.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `maritime-alerts-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const exportAsPDF = (alerts: Alert[]) => {
    // Simple HTML-based PDF export (would need a proper PDF library for production)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maritime Alerts Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; }
            .alert { border: 1px solid #ddd; margin: 10px 0; padding: 10px; }
            .severity-critical { border-left: 5px solid #dc2626; }
            .severity-high { border-left: 5px solid #ea580c; }
            .severity-medium { border-left: 5px solid #d97706; }
            .severity-low { border-left: 5px solid #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Maritime Intelligence Alerts Report</h1>
            <p>Generated: ${format(new Date(), 'PPpp')}</p>
            <p>Date Range: ${format(reportConfig.dateRange.from, 'PP')} - ${format(reportConfig.dateRange.to, 'PP')}</p>
          </div>
          
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Alerts: ${alerts.length}</p>
            <p>Critical: ${alerts.filter(a => a.severity === 'critical').length}</p>
            <p>High: ${alerts.filter(a => a.severity === 'high').length}</p>
            <p>Medium: ${alerts.filter(a => a.severity === 'medium').length}</p>
            <p>Low: ${alerts.filter(a => a.severity === 'low').length}</p>
          </div>

          <div class="alerts">
            <h2>Alert Details</h2>
            ${alerts.map(alert => `
              <div class="alert severity-${alert.severity}">
                <h3>${alert.title} (${alert.id})</h3>
                <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
                <p><strong>Type:</strong> ${alert.type}</p>
                <p><strong>Status:</strong> ${alert.status}</p>
                <p><strong>Description:</strong> ${alert.description}</p>
                <p><strong>Location:</strong> ${alert.location?.name || 'N/A'}</p>
                <p><strong>Timestamp:</strong> ${format(new Date(alert.timestamp), 'PPpp')}</p>
                <p><strong>Assignee:</strong> ${alert.assignee || 'Unassigned'}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadFile(blob, `maritime-alerts-report-${format(new Date(), 'yyyy-MM-dd')}.html`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">From Date</label>
              <Popover open={showFromCalendar} onOpenChange={setShowFromCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(reportConfig.dateRange.from, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reportConfig.dateRange.from}
                    onSelect={(date) => {
                      if (date) {
                        setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, from: date }
                        }));
                        setShowFromCalendar(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">To Date</label>
              <Popover open={showToCalendar} onOpenChange={setShowToCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(reportConfig.dateRange.to, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reportConfig.dateRange.to}
                    onSelect={(date) => {
                      if (date) {
                        setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, to: date }
                        }));
                        setShowToCalendar(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Severity</label>
              <Select value={reportConfig.severity} onValueChange={(value) => 
                setReportConfig(prev => ({ ...prev, severity: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Type</label>
              <Select value={reportConfig.type} onValueChange={(value) => 
                setReportConfig(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ghost_vessel">Ghost Vessel</SelectItem>
                  <SelectItem value="weather">Weather</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="collision">Collision</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Status</label>
              <Select value={reportConfig.status} onValueChange={(value) => 
                setReportConfig(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Export Format</label>
            <Select value={reportConfig.format} onValueChange={(value: 'json' | 'csv' | 'pdf') => 
              setReportConfig(prev => ({ ...prev, format: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON (Machine Readable)</SelectItem>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                <SelectItem value="pdf">HTML (Print Ready)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateReport} 
            disabled={isGenerating}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Report...' : 'Generate & Download Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Export Buttons */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Quick Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  dateRange: {
                    from: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    to: new Date()
                  },
                  severity: 'all',
                  status: 'all',
                  format: 'csv'
                }));
                setTimeout(generateReport, 100);
              }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Last 24 Hours</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  dateRange: {
                    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    to: new Date()
                  },
                  severity: 'critical',
                  status: 'all',
                  format: 'json'
                }));
                setTimeout(generateReport, 100);
              }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Critical Alerts (7d)</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  dateRange: {
                    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    to: new Date()
                  },
                  severity: 'all',
                  status: 'resolved',
                  format: 'csv'
                }));
                setTimeout(generateReport, 100);
              }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Monthly Summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManager;
