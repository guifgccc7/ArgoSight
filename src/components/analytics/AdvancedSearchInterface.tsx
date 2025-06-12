
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Brain, 
  Database,
  Clock,
  Target,
  MapPin,
  Ship
} from "lucide-react";

interface SearchFilters {
  query: string;
  type: string;
  severity: string;
  timeRange: string;
  location: string;
  vesselType: string;
}

interface SearchResult {
  id: string;
  type: 'vessel' | 'alert' | 'pattern' | 'intelligence';
  title: string;
  description: string;
  relevance: number;
  timestamp: string;
  location?: string;
  metadata: any;
}

const AdvancedSearchInterface = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    severity: 'all',
    timeRange: '24h',
    location: '',
    vesselType: 'all'
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced' | 'natural'>('simple');

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'vessel',
      title: 'MV Atlantic Star - High Risk Vessel',
      description: 'Cargo vessel showing multiple suspicious behavior patterns including AIS gaps and route deviations',
      relevance: 95,
      timestamp: '2024-01-15T10:30:00Z',
      location: 'North Sea',
      metadata: { vesselType: 'cargo', riskScore: 85 }
    },
    {
      id: '2',
      type: 'pattern',
      title: 'AIS Manipulation Pattern Detected',
      description: 'Multiple vessels in Mediterranean showing coordinated AIS signal manipulation',
      relevance: 88,
      timestamp: '2024-01-15T09:15:00Z',
      location: 'Mediterranean Sea',
      metadata: { patternType: 'ais_manipulation', confidence: 0.92 }
    },
    {
      id: '3',
      type: 'alert',
      title: 'Unauthorized Port Access',
      description: 'Critical security alert for unauthorized access at Rotterdam Terminal 3',
      relevance: 82,
      timestamp: '2024-01-15T08:45:00Z',
      location: 'Port of Rotterdam',
      metadata: { severity: 'critical', status: 'investigating' }
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Filter mock results based on query
      const filtered = mockResults.filter(result => {
        const matchesQuery = !filters.query || 
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.description.toLowerCase().includes(filters.query.toLowerCase());
        
        const matchesType = filters.type === 'all' || result.type === filters.type;
        
        return matchesQuery && matchesType;
      });
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handleNaturalLanguageQuery = () => {
    // Simulate natural language processing
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Search & Intelligence Query</h2>
          <p className="text-slate-400">AI-powered search across all maritime intelligence data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            <Brain className="h-3 w-3 mr-1" />
            NLP ENABLED
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            <Database className="h-3 w-3 mr-1" />
            MULTI-SOURCE
          </Badge>
        </div>
      </div>

      {/* Search Mode Selector */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-slate-300">Search Mode:</span>
            <div className="flex space-x-2">
              {[
                { id: 'simple', label: 'Simple Search', icon: Search },
                { id: 'advanced', label: 'Advanced Filters', icon: Filter },
                { id: 'natural', label: 'Natural Language', icon: Brain }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.id}
                    variant={searchMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchMode(mode.id as any)}
                    className={searchMode === mode.id ? "bg-cyan-600" : "border-slate-600"}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {mode.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder={
                      searchMode === 'natural' 
                        ? "Ask in natural language: 'Show me all high-risk vessels near restricted waters'"
                        : "Search vessels, alerts, patterns, intelligence..."
                    }
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="pl-10 bg-slate-900 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={searchMode === 'natural' ? handleNaturalLanguageQuery : handleSearch}
                disabled={isSearching}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isSearching ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    {searchMode === 'natural' ? 'Processing...' : 'Searching...'}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {searchMode === 'advanced' && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-slate-900 rounded-lg">
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vessel">Vessels</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                    <SelectItem value="pattern">Patterns</SelectItem>
                    <SelectItem value="intelligence">Intelligence</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.timeRange} onValueChange={(value) => setFilters({ ...filters, timeRange: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last Week</SelectItem>
                    <SelectItem value="30d">Last Month</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                />

                <Select value={filters.vesselType} onValueChange={(value) => setFilters({ ...filters, vesselType: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Vessel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vessels</SelectItem>
                    <SelectItem value="cargo">Cargo</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="fishing">Fishing</SelectItem>
                    <SelectItem value="passenger">Passenger</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-slate-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Search Results ({searchResults.length})</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Target className="h-3 w-3 mr-1" />
                RELEVANCE SORTED
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {result.type === 'vessel' && <Ship className="h-4 w-4 text-cyan-400" />}
                          {result.type === 'alert' && <Target className="h-4 w-4 text-red-400" />}
                          {result.type === 'pattern' && <Brain className="h-4 w-4 text-purple-400" />}
                          {result.type === 'intelligence' && <Database className="h-4 w-4 text-green-400" />}
                          <h3 className="text-white font-medium">{result.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                          {result.relevance}% match
                        </Badge>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-3">{result.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                        {result.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{result.location}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {result.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" className="border-slate-600">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Suggestions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Search Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "High-risk vessels near restricted waters",
              "Recent AIS manipulation patterns",
              "Critical security alerts this week",
              "Vessels with route deviations > 100km",
              "Suspicious rendezvous activities",
              "Dark vessels in North Sea region"
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setFilters({ ...filters, query: suggestion })}
              >
                <Search className="h-3 w-3 mr-2" />
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearchInterface;
