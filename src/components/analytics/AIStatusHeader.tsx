
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu } from "lucide-react";

interface AIStatusHeaderProps {
  mlStatus: any;
}

const AIStatusHeader = ({ mlStatus }: AIStatusHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Analytics Dashboard</h2>
        <p className="text-slate-400">Advanced pattern recognition with machine learning</p>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={mlStatus?.initialized ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"}>
          <Brain className="h-3 w-3 mr-1" />
          {mlStatus?.initialized ? 'ML ACTIVE' : 'ML LOADING'}
        </Badge>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
          <Cpu className="h-3 w-3 mr-1" />
          REAL-TIME
        </Badge>
      </div>
    </div>
  );
};

export default AIStatusHeader;
