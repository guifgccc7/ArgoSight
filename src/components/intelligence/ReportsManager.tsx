
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Plus, 
  Calendar,
  Clock,
  User,
  Shield,
  Archive,
  Search
} from "lucide-react";

const ReportsManager = () => {
  const [activeTab, setActiveTab] = useState("recent");

  const recentReports = [
    {
      id: 1,
      title: "Weekly Maritime Security Assessment",
      type: "Security Report",
      classification: "confidential",
      author: "Intelligence Team Alpha",
      created: "2024-01-15",
      size: "2.4 MB",
      status: "final"
    },
    {
      id: 2,
      title: "Arctic Route Accessibility Analysis",
      type: "Operational Report",
      classification: "restricted",
      author: "Climate Analysis Unit",
      created: "2024-01-14",
      size: "1.8 MB",
      status: "draft"
    },
    {
      id: 3,
      title: "Vessel Tracking Anomaly Summary",
      type: "Incident Report",
      classification: "secret",
      author: "Surveillance Division",
      created: "2024-01-13",
      size: "3.1 MB",
      status: "final"
    }
  ];

  const reportTemplates = [
    { name: "Security Incident Report", description: "Standard template for security incidents" },
    { name: "Vessel Analysis Report", description: "Comprehensive vessel behavior analysis" },
    { name: "Regional Threat Assessment", description: "Geographic threat level evaluation" },
    { name: "Climate Impact Analysis", description: "Environmental impact on operations" }
  ];

  const archivedReports = [
    {
      title: "Q4 2023 Maritime Intelligence Summary",
      date: "2023-12-31",
      classification: "restricted",
      downloads: 45
    },
    {
      title: "North Sea Security Assessment 2023",
      date: "2023-11-30",
      classification: "confidential",
      downloads: 23
    },
    {
      title: "Annual Vessel Traffic Analysis",
      date: "2023-10-15",
      classification: "secret",
      downloads: 67
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Intelligence Reports Manager</h2>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="archived">Archive</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Intelligence Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">{report.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {report.type}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {report.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.created}
                          </div>
                          <span>{report.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={
                          report.status === "final" ? "text-green-400 border-green-400" :
                          "text-yellow-400 border-yellow-400"
                        }>
                          {report.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          {report.classification.toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template, index) => (
                  <div key={index} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Archive className="h-5 w-5 mr-2" />
                Archived Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {archivedReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{report.title}</h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span>{report.date}</span>
                        <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                          {report.classification.toUpperCase()}
                        </Badge>
                        <span>{report.downloads} downloads</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">247</h3>
                <p className="text-sm text-slate-400">Total Reports Generated</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Download className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">1,429</h3>
                <p className="text-sm text-slate-400">Downloads This Month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">2.3</h3>
                <p className="text-sm text-slate-400">Avg. Processing Time (hours)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManager;
