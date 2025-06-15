
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Download, 
  Eye, 
  Calendar, 
  Cloud, 
  MapPin,
  Maximize2 
} from 'lucide-react';

interface SatelliteImage {
  satellite_name: string;
  image_url: string;
  thumbnail_url: string | null;
  scene_id: string;
  acquisition_time: string;
  cloud_cover_percentage: number;
  resolution_meters: number;
  bbox_north: number;
  bbox_south: number;
  bbox_east: number;
  bbox_west: number;
  file_size_mb: number;
  processing_level: string;
  provider: string;
  metadata?: {
    sun_azimuth?: number;
    sun_elevation?: number;
    view_angle?: number;
    quality_category?: string;
  };
}

interface SatelliteImageViewerProps {
  images: SatelliteImage[];
  isLoading?: boolean;
}

const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [imageLoadError, setImageLoadError] = useState<Set<string>>(new Set());

  const handleImageError = (sceneId: string) => {
    setImageLoadError(prev => new Set([...prev, sceneId]));
  };

  const getCloudCoverColor = (cloudCover: number) => {
    if (cloudCover < 10) return 'text-green-400';
    if (cloudCover < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
            <CardContent className="p-4">
              <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.scene_id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white flex items-center justify-between">
                <span className="truncate">{image.satellite_name}</span>
                <Badge variant="outline" className="text-xs">
                  {image.processing_level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Image Preview */}
              <div className="relative mb-4">
                {image.thumbnail_url && !imageLoadError.has(image.scene_id) ? (
                  <img
                    src={image.thumbnail_url}
                    alt={`Satellite image ${image.scene_id}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                    onError={() => handleImageError(image.scene_id)}
                  />
                ) : (
                  <div 
                    className="w-full h-48 bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="text-center text-slate-400">
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Preview Not Available</p>
                      <p className="text-xs">Click to view details</p>
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedImage(image)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Metadata */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(image.acquisition_time)}
                </div>
                
                <div className="flex items-center text-sm">
                  <Cloud className="h-4 w-4 mr-2 text-slate-400" />
                  <span className={getCloudCoverColor(image.cloud_cover_percentage)}>
                    {image.cloud_cover_percentage.toFixed(1)}% cloud cover
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  {image.resolution_meters}m resolution
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    {image.file_size_mb.toFixed(1)} MB
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => setSelectedImage(image)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{selectedImage.satellite_name} - {selectedImage.scene_id}</span>
                <Button variant="ghost" onClick={() => setSelectedImage(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Display */}
                <div>
                  {selectedImage.thumbnail_url && !imageLoadError.has(selectedImage.scene_id) ? (
                    <img
                      src={selectedImage.thumbnail_url}
                      alt={`Satellite image ${selectedImage.scene_id}`}
                      className="w-full rounded-lg"
                      onError={() => handleImageError(selectedImage.scene_id)}
                    />
                  ) : (
                    <div className="w-full h-96 bg-slate-700 rounded-lg flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <Image className="h-12 w-12 mx-auto mb-2" />
                        <p>Image Preview Not Available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Image Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Provider:</span>
                        <span className="text-white">{selectedImage.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Acquisition:</span>
                        <span className="text-white">{formatDate(selectedImage.acquisition_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cloud Cover:</span>
                        <span className={getCloudCoverColor(selectedImage.cloud_cover_percentage)}>
                          {selectedImage.cloud_cover_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resolution:</span>
                        <span className="text-white">{selectedImage.resolution_meters}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">File Size:</span>
                        <span className="text-white">{selectedImage.file_size_mb.toFixed(1)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Coverage Area</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">North:</span>
                        <span className="text-white">{selectedImage.bbox_north.toFixed(4)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">South:</span>
                        <span className="text-white">{selectedImage.bbox_south.toFixed(4)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">East:</span>
                        <span className="text-white">{selectedImage.bbox_east.toFixed(4)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">West:</span>
                        <span className="text-white">{selectedImage.bbox_west.toFixed(4)}°</span>
                      </div>
                    </div>
                  </div>

                  {selectedImage.metadata && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Capture Conditions</h3>
                      <div className="space-y-2 text-sm">
                        {selectedImage.metadata.sun_azimuth && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sun Azimuth:</span>
                            <span className="text-white">{selectedImage.metadata.sun_azimuth.toFixed(1)}°</span>
                          </div>
                        )}
                        {selectedImage.metadata.sun_elevation && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sun Elevation:</span>
                            <span className="text-white">{selectedImage.metadata.sun_elevation.toFixed(1)}°</span>
                          </div>
                        )}
                        {selectedImage.metadata.view_angle && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">View Angle:</span>
                            <span className="text-white">{selectedImage.metadata.view_angle.toFixed(1)}°</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Resolution
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {images.length === 0 && !isLoading && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No Satellite Images Found</h3>
            <p className="text-slate-400">Try adjusting your search parameters or coverage area.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SatelliteImageViewer;
