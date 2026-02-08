import React from 'react';
import type { Topic } from '../types';

interface BackgroundProps {
  topic: Topic;
}

const Background: React.FC<BackgroundProps> = ({ topic }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {/* Base Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 z-0"></div>
      
      {/* Dynamic Image Layer */}
      <div 
        key={topic.id} // Key change triggers re-render animation
        className="absolute inset-0 opacity-20 transition-opacity duration-1000 ease-in-out"
        style={{
             backgroundImage: `url(${topic.bgImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             filter: 'blur(8px)'
        }}
      ></div>

      {/* Animated Gradient Orb */}
      <div className={`
        absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30
        bg-gradient-to-b ${topic.color}
        transition-colors duration-1000 ease-in-out animate-pulse
      `}></div>

       {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );
};

export default Background;
