import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext/index';
import { doSignOut } from '../../firebase/auth';
import { AppBar, Toolbar, Typography, Slider, Box, TextField, Button } from '@mui/material';

import FilterOptions from '../books/FilterOptions';

const Header = ({ handleFilterChange }) => {
    const navigate = useNavigate();
    const { userLoggedIn, currentUser } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                {userLoggedIn && (
                  <FilterOptions/>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {userLoggedIn ? (
                        <>
                            <Typography variant="body1">
                                {currentUser.displayName ? currentUser.displayName : currentUser.email}
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={() => {
                                    doSignOut().then(() => {
                                        navigate('/login');
                                    });
                                }}
                                className='text-sm text-blue-600 underline'
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link className='text-sm text-blue-600 underline' to={'/login'} style={{ marginRight: '1rem' }}>
                                Login
                            </Link>
                            <Link className='text-sm text-blue-600 underline' to={'/register'}>
                                Register New Account
                            </Link>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

