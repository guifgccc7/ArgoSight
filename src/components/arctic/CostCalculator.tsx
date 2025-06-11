
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";

interface CalculationResult {
  traditionalCost: number;
  arcticCost: number;
  savings: number;
  timeSavings: number;
  co2Reduction: number;
  roi: number;
}

const CostCalculator = () => {
  const [vessel, setVessel] = useState({
    type: 'container',
    size: '20000',
    fuelConsumption: '250',
    crewCost: '15000'
  });
  
  const [route, setRoute] = useState({
    origin: 'asia',
    destination: 'europe',
    cargo: '15000',
    frequency: '12'
  });
  
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  const calculateSavings = useCallback(() => {
    // Realistic calculation based on industry data
    const vesselSize = parseInt(vessel.size);
    const fuelConsumption = parseInt(vessel.fuelConsumption);
    const cargoValue = parseInt(route.cargo);
    const frequency = parseInt(route.frequency);
    
    // Traditional route (Suez Canal)
    const traditionalDistance = 12500; // nautical miles
    const traditionalDays = 25;
    const traditionalFuelCost = (traditionalDistance / 24) * fuelConsumption * 800; // $800/ton fuel
    const traditionalPortFees = 85000; // Suez Canal fees
    const traditionalCrewCost = (traditionalDays / 30) * parseInt(vessel.crewCost);
    const traditionalTotal = (traditionalFuelCost + traditionalPortFees + traditionalCrewCost) * frequency;
    
    // Arctic route
    const arcticDistance = 8500; // nautical miles (32% shorter)
    const arcticDays = 17;
    const arcticFuelCost = (arcticDistance / 22) * fuelConsumption * 850; // Slightly higher fuel cost
    const arcticPortFees = 25000; // Lower port fees
    const arcticCrewCost = (arcticDays / 30) * parseInt(vessel.crewCost) * 1.2; // 20% premium for Arctic crew
    const arcticInsurance = vesselSize * 5; // Arctic insurance premium
    const arcticTotal = (arcticFuelCost + arcticPortFees + arcticCrewCost + arcticInsurance) * frequency;
    
    const savings = traditionalTotal - arcticTotal;
    const timeSavings = (traditionalDays - arcticDays) * frequency;
    const co2Reduction = ((traditionalDistance - arcticDistance) * fuelConsumption * 3.1) * frequency; // 3.1 tons CO2 per ton fuel
    const roi = (savings / traditionalTotal) * 100;
    
    setResult({
      traditionalCost: traditionalTotal,
      arcticCost: arcticTotal,
      savings,
      timeSavings,
      co2Reduction,
      roi
    });
  }, [vessel, route]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-cyan-400" />
            Arctic Route Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Vessel Information</h3>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Vessel Type</Label>
                <Select value={vessel.type} onValueChange={(value) => setVessel({...vessel, type: value})}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="container">Container Ship</SelectItem>
                    <SelectItem value="bulk">Bulk Carrier</SelectItem>
                    <SelectItem value="tanker">Oil Tanker</SelectItem>
                    <SelectItem value="lng">LNG Carrier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Vessel Size (TEU/DWT)</Label>
                <Input
                  type="number"
                  value={vessel.size}
                  onChange={(e) => setVessel({...vessel, size: e.target.value})}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Daily Fuel Consumption (tons)</Label>
                <Input
                  type="number"
                  value={vessel.fuelConsumption}
                  onChange={(e) => setVessel({...vessel, fuelConsumption: e.target.value})}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Monthly Crew Cost ($)</Label>
                <Input
                  type="number"
                  value={vessel.crewCost}
                  onChange={(e) => setVessel({...vessel, crewCost: e.target.value})}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Route Information</h3>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Origin</Label>
                <Select value={route.origin} onValueChange={(value) => setRoute({...route, origin: value})}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="asia">Asia (Shanghai/Singapore)</SelectItem>
                    <SelectItem value="middle-east">Middle East</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Destination</Label>
                <Select value={route.destination} onValueChange={(value) => setRoute({...route, destination: value})}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="europe">Europe (Rotterdam/Hamburg)</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="scandinavia">Scandinavia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Cargo Value ($1000s)</Label>
                <Input
                  type="number"
                  value={route.cargo}
                  onChange={(e) => setRoute({...route, cargo: e.target.value})}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Annual Voyages</Label>
                <Input
                  type="number"
                  value={route.frequency}
                  onChange={(e) => setRoute({...route, frequency: e.target.value})}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={calculateSavings}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            Calculate Savings
          </Button>
        </CardContent>
      </Card>
      
      {result && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Cost Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Traditional Route</span>
                  <DollarSign className="h-4 w-4 text-red-400" />
                </div>
                <div className="text-xl font-bold text-white">{formatCurrency(result.traditionalCost)}</div>
                <div className="text-xs text-slate-400">Annual cost via Suez</div>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Arctic Route</span>
                  <DollarSign className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-white">{formatCurrency(result.arcticCost)}</div>
                <div className="text-xs text-slate-400">Annual cost via Arctic</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm">Total Savings</span>
                  <TrendingUp className="h-4 w-4 text-green-200" />
                </div>
                <div className="text-xl font-bold text-white">{formatCurrency(result.savings)}</div>
                <div className="text-xs text-green-200">Annual savings</div>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">ROI</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {result.roi.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xl font-bold text-white">{result.timeSavings} days</div>
                <div className="text-xs text-slate-400">Time saved annually</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Environmental Impact</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">CO₂ Reduction:</span>
                    <span className="text-green-400">{(result.co2Reduction / 1000).toFixed(1)}k tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Distance Saved:</span>
                    <span className="text-cyan-400">4,000 nm per voyage</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Operational Benefits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Faster Delivery:</span>
                    <span className="text-cyan-400">8 days earlier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Reduced Port Congestion:</span>
                    <span className="text-green-400">60% less wait time</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostCalculator;
