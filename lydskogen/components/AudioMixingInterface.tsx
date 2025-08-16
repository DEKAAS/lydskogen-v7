'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RotaryControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const RotaryControl = ({ label, value, onChange, min = 0, max = 100 }: RotaryControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const angle = (value / max) * 270 - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      const newValue = Math.max(min, Math.min(max, normalizedAngle * max));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div 
        className={`relative w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-900 cursor-pointer transition-all duration-200 ${
          isDragging ? 'border-gray-400 shadow-lg' : 'hover:border-gray-500'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
          style={{
            background: `conic-gradient(from 0deg, #374151 0deg, #4b5563 ${(value/max)*360}deg, #374151 ${(value/max)*360}deg)`
          }}
        >
          <div 
            className="absolute w-1 h-6 bg-gray-300 rounded-full origin-bottom"
            style={{
              transform: `rotate(${angle}deg)`,
              top: '4px',
              left: '50%',
              transformOrigin: '50% 100%',
              marginLeft: '-2px'
            }}
          />
        </div>
        <div className="absolute inset-3 rounded-full bg-black border border-gray-800" />
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-400 font-medium">{label}</div>
        <div className="text-sm text-gray-300 font-mono">{Math.round(value)}</div>
      </div>
    </div>
  );
};

const WaveformDisplay = () => {
  const waveformData = Array.from({ length: 100 }, (_, i) => 
    Math.sin(i * 0.1) * 50 + Math.random() * 20
  );

  return (
    <div className="h-full bg-black border border-gray-700 rounded-lg p-4">
      <div className="h-full flex items-center justify-center">
        <svg className="w-full h-32" viewBox="0 0 400 128">
          <path
            d={`M 0 64 ${waveformData.map((point, i) => 
              `L ${i * 4} ${64 + point}`
            ).join(' ')}`}
            stroke="#6b7280"
            strokeWidth="1"
            fill="none"
          />
          <path
            d={`M 0 64 ${waveformData.map((point, i) => 
              `L ${i * 4} ${64 - point}`
            ).join(' ')}`}
            stroke="#6b7280"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default function AudioMixingInterface() {
  const [activeTab, setActiveTab] = useState('mixing');
  const [showModal, setShowModal] = useState(false);
  const [controls, setControls] = useState({
    gain: 50,
    eq: 30,
    reverb: 20,
    delay: 15,
    comp: 40
  });

  const navigationItems = [
    { id: 'mixing', label: 'Mixing', icon: '🎛️' },
    { id: 'effects', label: 'Effects', icon: '🎵' },
    { id: 'master', label: 'Master', icon: '🎯' },
    { id: 'export', label: 'Export', icon: '📤' }
  ];

  const updateControl = (key: string, value: number) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 h-screen">
        
        {/* Left Sidebar - Navigation */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-6">Studio</h2>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === item.id 
                    ? 'bg-gray-800 text-white border border-gray-600' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Book Button */}
          <motion.button
            onClick={() => setShowModal(true)}
            className="w-full mt-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Session
          </motion.button>
        </div>

        {/* Middle Section - Rotary Controls */}
        <div className="lg:col-span-4 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Mixing Controls</h3>
          <div className="flex flex-col space-y-8 items-center">
            <RotaryControl 
              label="GAIN" 
              value={controls.gain} 
              onChange={(value) => updateControl('gain', value)} 
            />
            <RotaryControl 
              label="EQ" 
              value={controls.eq} 
              onChange={(value) => updateControl('eq', value)} 
            />
            <RotaryControl 
              label="REVERB" 
              value={controls.reverb} 
              onChange={(value) => updateControl('reverb', value)} 
            />
            <RotaryControl 
              label="DELAY" 
              value={controls.delay} 
              onChange={(value) => updateControl('delay', value)} 
            />
            <RotaryControl 
              label="COMP" 
              value={controls.comp} 
              onChange={(value) => updateControl('comp', value)} 
            />
          </div>
        </div>

        {/* Right Panel - Waveform Display */}
        <div className="lg:col-span-6 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Waveform Preview</h3>
          <WaveformDisplay />
          
          {/* Transport Controls */}
          <div className="flex justify-center space-x-4 mt-6">
            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg">
              ⏮️
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-6 py-2 rounded-lg">
              ▶️
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg">
              ⏭️
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-100 mb-4">Audio Mixing</h3>
            <p className="text-gray-300 mb-6">
              This is mixing - where your raw audio transforms into polished, professional sound. 
              Our expert engineers balance levels, apply effects, and craft the perfect sonic landscape.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}