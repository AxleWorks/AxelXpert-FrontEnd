import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';

const AuthLayout = ({ leftContent, rightContent, backgroundImage }) => {
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        color: 'white',
        position: 'relative',
        textAlign: 'center',
        boxSizing: 'border-box',
        '&::before': {
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
        padding: 0,
        margin: 0,
        minHeight: '100vh',
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
                <Grid item xs={12} md={6} sx={{ ...leftStyles }}>
                    <Box sx={{ 
                        position: 'relative', 
                        zIndex: 2, 
                        width: '70%',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                    }}>
                        {leftContent}
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{ ...rightStyles }}>
                    {rightContent}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;
