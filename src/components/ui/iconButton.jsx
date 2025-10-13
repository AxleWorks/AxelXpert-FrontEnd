import React from 'react';
import { Button as MuiButton } from '@mui/material';

// IconTextButton: renders an icon followed by text inside a pill-like outlined button.
// Props: icon (element), text (string), variant: 'outline' | 'destructive', size: 'sm'|'md', onClick
export const IconTextButton = ({ icon, text, variant = 'outline', size = 'sm', onClick, className }) => {
  const isDestructive = variant === 'destructive';
  const padding = size === 'sm' ? '6px 10px' : '8px 14px';

  return (
    <MuiButton
      onClick={onClick}
      variant={isDestructive ? 'outlined' : 'outlined'}
      sx={{
        textTransform: 'none',
        padding,
        borderRadius: 20,
        borderColor: isDestructive ? 'rgba(220,38,38,0.12)' : 'rgba(0,0,0,0.08)',
        color: isDestructive ? 'error.main' : 'text.primary',
        backgroundColor: 'transparent',
        minWidth: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        '&:hover': {
          backgroundColor: isDestructive ? 'rgba(220,38,38,0.04)' : 'rgba(0,0,0,0.02)'
        }
      }}
      size={size === 'sm' ? 'small' : 'medium'}
      className={className}
    >
      {icon}
      <span style={{ fontWeight: 600 }}>{text}</span>
    </MuiButton>
  );
};

export default IconTextButton;
