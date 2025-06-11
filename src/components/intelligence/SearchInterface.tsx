
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Ship,
  AlertTriangle,
  FileText,
  Database
} from "lucide-react";

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    vesselType: "",
    threatLevel: "",
    timeRange: "",
    region: "",
    classification: ""
  });

  const searchResults = [
    {
      id: 1,
      title: "Suspicious Vessel Activity - North Sea",
      type: "Vessel Alert",
      threatLevel: "high",
      classification: "restricted",
      timestamp: "2024-01-15 14:30",
      location: "North Sea, 56.2°N 3.1°E",
      summary: "Unidentified vessel exhibiting unusual navigation patterns near offshore installations"
    },
    {
      id: 2,
      title: "Climate Change Impact Assessment - Arctic Routes",
      type: "Intelligence Report",
      threatLevel: "medium",
      classification: "confidential",
      timestamp: "2024-01-14 09:15",
      location: "Arctic Ocean",
      summary: "Analysis of ice coverage changes affecting shipping lane accessibility"
    },
    {
      id: 3,
      title: "Port Security Breach - Mediterranean",
      type: "Security Incident",
      threatLevel: "high",
      classification: "secret",
      timestamp: "2024-01-13 22:45",
      location: "Port of Valencia, Spain",
      summary: "Unauthorized access detected in restricted port area during cargo operations"
    }
  ];

  const handleSearch = () => {
    console.log("Searching with query:", searchQuery, "Filters:", filters);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search intelligence reports, vessel data, security incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <Button onClick={handleSearch} className="bg-cyan-600 hover:bg-cyan-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={filters.vesselType} onValueChange={(value) => setFilters({...filters, vesselType: value})}>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="Vessel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cargo">Cargo</SelectItem>
                <SelectItem value="tanker">Tanker</SelectItem>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem value="military">Military</SelectItem>
                <SelectItem value="fishing">Fishing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.threatLevel} onValueChange={(value) => setFilters({...filters, threatLevel: value})}>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="Threat Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.timeRange} onValueChange={(value) => setFilters({...filters, timeRange: value})}>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-sea">North Sea</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="arctic">Arctic</SelectItem>
                <SelectItem value="atlantic">Atlantic</SelectItem>
                <SelectItem value="pacific">Pacific</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.classification} onValueChange={(value) => setFilters({...filters, classification: value})}>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unclassified">Unclassified</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="secret">Secret</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Search Results ({searchResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">{result.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {result.type}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {result.timestamp}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {result.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className={
                      result.threatLevel === "high" ? "text-red-400 border-red-400" :
                      result.threatLevel === "medium" ? "text-yellow-400 border-yellow-400" :
                      "text-green-400 border-green-400"
                    }>
                      {result.threatLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {result.classification.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{result.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchInterface;
