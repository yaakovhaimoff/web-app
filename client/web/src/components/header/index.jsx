import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

import FilterOptions from '../books/FilterOptions';
import { useAuth } from '../../contexts/authContext/index';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn, currentUser } = useAuth();

    const renderToolBar = () => {
        return (
                <FilterOptions
                    handleFilterChange={handleFilterChange} />
        );
    }

    const handleFilterChange = (publicationYear) => {
        console.log("change")
        const params = [];
        if (publicationYear) {
            params.push(`after=${publicationYear[0]}&before=${publicationYear[1]}`)
        }

        let url = `$/books${params ? `?${params.join('&')}` : ``}`;
        axios.get(url)
            .then((response) => {
                setBooks(response.data.Books)
            })
            .catch((error) => console.error(error));
    }

    return (
        <AppBar position="static">
            <Toolbar>
                {userLoggedIn && (
                    renderToolBar()
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

