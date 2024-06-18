// BookDetails.js
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from 'axios';
import {Button, Container, Grid, Paper, TextField, Typography, Card, CardContent, Box, Rating} from '@mui/material';

const BookDetails = () => {
    const {bookId} = useParams();
    const navigate = useNavigate();
    const [newReviewer, setNewReviewer] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newRating, setNewRating] = useState(1);
    const [book, setBook] = useState([])

    axios.defaults.withCredentials = true;

    const baseURL = "http://localhost:3000";

    useEffect(() => {
        getBook();
        getReviews();
    })

    const getBook = () => {
        axios.get(`${baseURL}/books/${bookId}`)
            .then((response) => setBook(response.data.book))
            .catch((error) => console.error(error));
    }

    const getReviews = () => {
        axios.get(`${baseURL}/books/${bookId}`)
            .then((response) => setBook(response.data.book))
            .catch((error) => console.error(error));
    }

    const onBookListBtn = () => {
        navigate('/')
    }

    const renderReview = () => {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Some reviewer ...
                    </Typography>
                    <Box display="flex" alignItems="center" mb={2} data-testid={'review-rating'}>
                        <Rating value='3' readOnly/>
                    </Box>
                    <Typography variant="body2" component="p">
                        Some review content ...
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Container maxWidth="sm">
            <br/>
            <Typography variant="h4" align="center" gutterBottom data-testid='bookDetails-title'>
                Book Details
            </Typography>
            {book ? (
                <Paper sx={{p: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" data-testid={`bookDetails-title-${book.id}`}>Title:</Typography>
                            <Typography variant="body1"
                                        data-testid={`bookDetails-titleContent-${book.id}`}>{book.title}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" data-testid={`bookDetails-author-${book.id}`}>Author:</Typography>
                            <Typography variant="body1"
                                        data-testid={`bookDetails-authorContent-${book.id}`}>{book.author}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" data-testid={`bookDetails-publicationYear-${book.id}`}>Publication
                                Year:</Typography>
                            <Typography variant="body1"
                                        data-testid={`bookDetails-publicationYearContent-${book.id}`}>{book.publicationYear}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6"
                                        data-testid={`bookDetails-description-${book.id}`}>Description:</Typography>
                            <Typography variant="body1"
                                        data-testid={`bookDetails-descriptionContent-${book.id}`}>{book.description}</Typography>
                        </Grid>
                        <Grid item xs={12} data-testid={`bookDetails-reviews`}>
                            <Typography variant="h6" >Reviews:</Typography>
                            {
                                // get reviews here
                                renderReview()
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" data-testid={`bookDetails-addReview-${book.id}`}>Add
                                Review</Typography>
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                onChange={(event) => {
                                    setNewReviewer(event.target.value);
                                }}
                                data-testid={`bookDetails-reviewNameField-${book.id}`}/>
                            <TextField
                                label="Review"
                                fullWidth
                                margin="normal"
                                multiline
                                onChange={(event) => {
                                    setNewContent(event.target.value);
                                }}
                                data-testid={`bookDetails-reviewContentField-${book.id}`}/>
                            <TextField
                                label="Rating"
                                fullWidth
                                margin="normal"
                                type="number"
                                onChange={(event) => {
                                    setNewRating(event.target.value);
                                }}
                                inputProps={{min: 1, max: 5}}
                                data-testid={`bookDetails-reviewRatingField-${book.id}`}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    // add code here
                                }}
                                data-testid={`bookDetails-submitReviewBtn-${book.id}`}>
                                Submit Review
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            ) : (
                <Typography variant="body1" align="center">
                    Loading book details...
                </Typography>
            )}
            <br/>
            <Button variant="contained" color="primary" onClick={onBookListBtn} data-testid='filters-bookListBtn'>
                Book Listing
            </Button>
        </Container>
    );
};

export default BookDetails;

