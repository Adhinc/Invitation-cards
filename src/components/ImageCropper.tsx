import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropUtils';
import { motion } from 'framer-motion';
import { X, Check, RotateCw, ZoomIn } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspect?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: any) => setZoom(zoom);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 md:p-8"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden flex flex-col h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="serif text-xl font-black text-slate-800">Crop Image</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#C85C6C] px-2.5 py-1 rounded-lg">
              {aspect === 1 ? 'Square' : aspect > 1 ? 'Landscape' : 'Portrait'}
            </span>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-slate-400 hover:text-rose-500">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-slate-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            rotation={rotation}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            classes={{
               containerClassName: "rounded-b-[32px]",
            }}
          />
        </div>

        <div className="p-8 space-y-8 bg-white">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ZoomIn size={18} className="text-slate-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#C85C6C]"
              />
            </div>
            <div className="flex items-center gap-4">
              <RotateCw size={18} className="text-slate-400" />
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1 accent-[#C85C6C]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCrop}
              className="flex-1 py-4 bg-[#C85C6C] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Save Image <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCropper;
