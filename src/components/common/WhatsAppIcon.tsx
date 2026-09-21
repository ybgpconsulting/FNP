import React from 'react';

interface WhatsAppIconProps {
  className?: string;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ className = 'w-4 h-4' }) => (
  <img
    src="https://cdn.simpleicons.org/whatsapp/FFFFFF"
    alt=""
    aria-hidden="true"
    className={className}
  />
);
