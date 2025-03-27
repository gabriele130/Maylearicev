import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/Logo_def_MAYLEA_marrone_su_bianco__2_-removebg-preview.png" 
      alt="Maylea Logistics & Transport Logo" 
      className={className || "h-14 w-auto"} 
    />
  );
};

export default Logo;