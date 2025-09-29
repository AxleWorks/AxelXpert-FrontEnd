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

    // left column responsive styles: explicit xs and md values to avoid leakage
    const leftStyles = {
        margin: 0,
    // wrap URL in quotes to ensure proper CSS generation
    backgroundImage: { xs: 'none', md: `url("${backgroundImage}")` },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: { xs: '#0f172a', md: 'transparent' },
        height: { xs: 140, md: '100vh' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 2, md: 2 },
        color: 'white',
        position: { xs: 'fixed', md: 'relative' },
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 'auto' },
        bottom: { xs: 0, md: 'auto' },
        zIndex: { xs: 1200, md: 'auto' },
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
            // reduced overlay opacity so the background image shows through
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
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
        // make room for the fixed branding bar on small screens so content doesn't get hidden
        pb: { xs: '160px', md: 0 }
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

                <Grid item xs={12} md={6} sx={leftStyles} order={{ xs: 2, md: 1 }}>
                    {/* Background image element shown only on md+ so the image reliably renders */}
                    <Box
                        component="img"
                        src={backgroundImage}
                        alt=""
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                        }}
                    />

                    <Box sx={{ 
                        position: 'relative', 
                        zIndex: 2, 
                        width: { xs: '100%', md: '70%' },
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: { xs: 1 },
                        height: { xs: 'auto', md: '100%' }
                    }}>
                        {leftContent}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;
