import React from 'react';
import { Typography } from '@mui/material';

const AuthBranding = ({ title, subtitle }) => {
    return (
        <>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    fontSize: { xs: '3rem', md: '4.5rem', lg: '5.5rem' },
                    textAlign: 'center',
                    lineHeight: 1.1,
                    width: '100%'
                }}
            >
                <span style={{ color: '#3b82f6' }}>Axle</span>Xpert
            </Typography>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' },
                    textAlign: 'center'
                }}
            >
                {subtitle}
            </Typography>
        </>
    );
};

export default AuthBranding;
