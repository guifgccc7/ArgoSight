
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Eye, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause,
  Settings,
  Maximize
} from "lucide-react";

interface Vessel3D {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  trail: [number, number, number][];
  status: 'active' | 'warning' | 'danger';
}

const Advanced3DVesselTracking: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vessels, setVessels] = useState<Vessel3D[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState([1]);
  const [viewMode, setViewMode] = useState<'3d' | 'heatmap' | 'density'>('3d');
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

  useEffect(() => {
    // Initialize 3D scene with mock data
    const initVessels: Vessel3D[] = [
      {
        id: 'v1',
        name: 'Baltic Explorer',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        color: '#00ff00',
        trail: [],
        status: 'active'
      },
      {
        id: 'v2', 
        name: 'Arctic Voyager',
        position: [5, 2, -3],
        rotation: [0, 45, 0],
        scale: 1.2,
        color: '#ff6600',
        trail: [[4, 1, -2], [3, 0, -1]],
        status: 'warning'
      },
      {
        id: 'v3',
        name: 'Mediterranean Star',
        position: [-3, -1, 4],
        rotation: [0, -30, 0],
        scale: 0.8,
        color: '#ff0000',
        trail: [[-2, 0, 3], [-1, 1, 2]],
        status: 'danger'
      }
    ];
    setVessels(initVessels);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isPlaying) {
        setVessels(prev => prev.map(vessel => ({
          ...vessel,
          position: [
            vessel.position[0] + (Math.random() - 0.5) * 0.1,
            vessel.position[1] + (Math.random() - 0.5) * 0.05,
            vessel.position[2] + (Math.random() - 0.5) * 0.1
          ],
          trail: [...vessel.trail, vessel.position].slice(-10)
        })));
      }
    }, 1000 / timeScale[0]);

    return () => clearInterval(interval);
  }, [isPlaying, timeScale]);

  const handleReset = () => {
    // Reset camera position and vessel selection
    setSelectedVessel(null);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            <span>Advanced 3D Vessel Tracking</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {vessels.length} VESSELS
            </Badge>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {viewMode.toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
                className="text-white border-slate-600"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-white border-slate-600"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Speed:</span>
                <div className="w-20">
                  <Slider
                    value={timeScale}
                    onValueChange={setTimeScale}
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="text-cyan-400"
                  />
                </div>
                <span className="text-xs text-slate-400">{timeScale[0]}x</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === '3d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                  className="text-xs"
                >
                  3D
                </Button>
                <Button
                  variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('heatmap')}
                  className="text-xs"
                >
                  Heat
                </Button>
                <Button
                  variant={viewMode === 'density' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('density')}
                  className="text-xs"
                >
                  Density
                </Button>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="relative bg-slate-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800"
            />
            
            {/* Mock 3D visualization overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-8 opacity-80">
                {vessels.map((vessel, index) => (
                  <div
                    key={vessel.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVessel === vessel.id
                        ? 'border-cyan-400 bg-cyan-900/30'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedVessel(vessel.id)}
                    style={{
                      transform: `perspective(500px) rotateX(${vessel.rotation[0]}deg) rotateY(${vessel.rotation[1]}deg) scale(${vessel.scale})`,
                      animationDelay: `${index * 0.5}s`
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2`} style={{ backgroundColor: vessel.color }}>
                      <div className="w-full h-full rounded-full animate-pulse opacity-70"></div>
                    </div>
                    <p className="text-xs text-white text-center font-medium">{vessel.name}</p>
                    <p className="text-xs text-slate-400 text-center">{vessel.status.toUpperCase()}</p>
                    
                    {/* Trail effect */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1">
                        {vessel.trail.slice(-3).map((_, trailIndex) => (
                          <div
                            key={trailIndex}
                            className="w-1 h-1 rounded-full bg-cyan-400"
                            style={{ opacity: (trailIndex + 1) * 0.3 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fullscreen button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 text-white border-slate-600"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Vessel Details Panel */}
          {selectedVessel && (
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <h4 className="text-white font-medium mb-2">Vessel Details</h4>
              {vessels.filter(v => v.id === selectedVessel).map(vessel => (
                <div key={vessel.id} className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="text-white">{vessel.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Position</p>
                    <p className="text-white font-mono">
                      [{vessel.position.map(p => p.toFixed(1)).join(', ')}]
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Status</p>
                    <Badge 
                      variant="outline" 
                      className={
                        vessel.status === 'active' ? 'text-green-400 border-green-400' :
                        vessel.status === 'warning' ? 'text-yellow-400 border-yellow-400' :
                        'text-red-400 border-red-400'
                      }
                    >
                      {vessel.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Advanced3DVesselTracking;
