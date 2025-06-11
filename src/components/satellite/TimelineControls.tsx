
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const TimelineControls = () => {
  const [currentTime, setCurrentTime] = useState([50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const timelineData = [
    { date: "2024-01-15", time: "14:32", quality: "High", cloudCover: 5 },
    { date: "2024-01-10", time: "15:18", quality: "Medium", cloudCover: 15 },
    { date: "2024-01-05", time: "13:45", quality: "High", cloudCover: 8 },
    { date: "2024-01-01", time: "16:22", quality: "High", cloudCover: 12 },
  ];

  const currentImageIndex = Math.floor((currentTime[0] / 100) * (timelineData.length - 1));
  const currentImage = timelineData[currentImageIndex] || timelineData[0];

  const handleTimeChange = useCallback((value: number[]) => {
    setCurrentTime(value);
  }, []);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Timeline Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Historical Timeline</span>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {timelineData.length} images available
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={currentTime}
                onValueChange={handleTimeChange}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Jan 1, 2024</span>
                <span>Jan 15, 2024</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={togglePlayback}
              className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button size="sm" variant="outline" onClick={changePlaybackSpeed}>
              {playbackSpeed}x Speed
            </Button>
            <Button size="sm" variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Current Image Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Date:</span>
              <span className="text-white">{currentImage.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Time:</span>
              <span className="text-white">{currentImage.time} UTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Quality:</span>
              <span className={`${currentImage.quality === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                {currentImage.quality}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Cloud Cover:</span>
              <span className="text-white">{currentImage.cloudCover}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineControls;
