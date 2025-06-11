
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Database, FileText } from "lucide-react";

const IntelligenceDB = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Intelligence Database</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-cyan-400" />
              <span className="text-white">Search & Query</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-400">Advanced intelligence search capabilities</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-400" />
              <span className="text-white">Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">Secure intelligence data storage and management</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-slate-400">Automated intelligence report generation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceDB;
