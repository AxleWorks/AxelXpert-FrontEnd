import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';

const AuthLayout = ({ leftContent, rightContent, backgroundImage }) => {
    // Keep margins/paddings clean but avoid forcing viewport sizes or hiding overflow
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        const root = document.getElementById('root');
        if (root) {
            root.style.margin = '0';
            root.style.padding = '0';
        }
        return () => {
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.documentElement.style.margin = '';
            document.documentElement.style.padding = '';
            if (root) {
                root.style.margin = '';
                root.style.padding = '';
            }
        };
    }, []);

    const leftStyles = {
        margin: 0,
        // Only show background image on md+ screens. On small screens use a solid background so text stays readable.
        backgroundImage: { xs: 'none', md: `url(${backgroundImage})` },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: { xs: '#0f172a', md: 'transparent' },
        minHeight: { xs: 'auto', md: '100vh' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 4, md: 2 },
        color: 'white',
        position: 'relative',
        textAlign: 'center',
        boxSizing: 'border-box',
        '&::before': {
            display: { xs: 'none', md: 'block' },
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
        }
    };

    const rightStyles = {
        padding: { xs: 4, md: 0 },
        margin: 0,
        minHeight: { xs: 'auto', md: '100vh' },
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            margin: 0,
            padding: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            boxSizing: 'border-box',
        }}>
            <Grid container sx={{ minHeight: '100vh', width: '100%', margin: 0 }}>
                {/* Show form first on small screens for quicker access */}
                <Grid item xs={12} md={6} sx={{ ...rightStyles }} order={{ xs: 1, md: 2 }}>
                    {rightContent}
                </Grid>

                <Grid item xs={12} md={6} sx={{ ...leftStyles }} order={{ xs: 2, md: 1 }}>
                    <Box sx={{ 
                        position: 'relative', 
                        zIndex: 2, 
                        width: { xs: '100%', md: '70%' },
                        textAlign: 'center',
                        boxSizing: 'border-box'
                    }}>
                        {leftContent}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;
