import React, { useState } from 'react';
import {
    Typography,
    Grid,
    TextField,
    Button,
    Container,
} from '@mui/material';
import axios from 'axios';
const FilterProductsComponent: React.FC = () => {
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [priceFilter, setPriceFilter] = useState<number | null>(null);
    const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
    const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
    const [categoryIdFilter, setCategoryIdFilter] = useState<number | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const handleTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleFilter(event.target.value);
    };
    const handlePriceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = Number(event.target.value);
        setPriceFilter(Number.isNaN(price) ? null : price);
    };
    const handleMinPriceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const minPrice = Number(event.target.value);
        setMinPriceFilter(Number.isNaN(minPrice) ? null : minPrice);
    };
    const handleMaxPriceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const maxPrice = Number(event.target.value);
        setMaxPriceFilter(Number.isNaN(maxPrice) ? null : maxPrice);
    };
    const handleCategoryIdFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const categoryId = Number(event.target.value);
        setCategoryIdFilter(Number.isNaN(categoryId) ? null : categoryId);
    };
    const fetchFilteredProducts = async () => {
        try {
            const url = 'https://api.escuelajs.co/api/v1/products';
            const params = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            let filteredProducts = [];
            let query = '';
            if (titleFilter || priceFilter || minPriceFilter || maxPriceFilter || categoryIdFilter) {
                const queryParams = [];
                if (titleFilter) {
                    queryParams.push(`title=${titleFilter}`);
                }
                if (priceFilter !== null) {
                    queryParams.push(`price=${priceFilter}`);
                }
                if (minPriceFilter !== null && maxPriceFilter !== null) {
                    queryParams.push(`price_min=${minPriceFilter}&price_max=${maxPriceFilter}`);
                }
                if (categoryIdFilter !== null) {
                    queryParams.push(`categoryId=${categoryIdFilter}`);
                }
                query = queryParams.join('&');
            }
            if (query) {
                const filteredUrl = `${url}/?${query}`;
                const response = await axios.get(filteredUrl, params);
                filteredProducts = response.data;
            } else {
                // Fetch all products if no filters are applied
                const allProductsUrl = `${url}/?limit=10&offset=10`;
                const response = await axios.get(allProductsUrl, params);
                filteredProducts = response.data;
            }

            if (filteredProducts.length === 0) {
                // Handle no matching filter results
                console.log('No matching filter results.');
            } else {
                // Set the filtered products state
                setFilteredProducts(filteredProducts);
            }
            // Clear filter variables after fetching filtered products
            /*setTitleFilter('');
            setPriceFilter(null);
            setMinPriceFilter(null);
            setMaxPriceFilter(null);
            setCategoryIdFilter(null);*/
        } catch (error) {
            console.log('Error fetching filtered products:', error);
        }
    };
    return (
        <Container maxWidth="md">
            <Typography variant="h5" gutterBottom>
                Filter Products
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Filter by title"
                        fullWidth
                        value={titleFilter}
                        onChange={handleTitleFilterChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Filter by price"
                        type="number"
                        fullWidth
                        value={priceFilter || ''}
                        onChange={handlePriceFilterChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Filter by min price"
                        type="number"
                        fullWidth
                        value={minPriceFilter || ''}
                        onChange={handleMinPriceFilterChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Filter by max price"
                        type="number"
                        fullWidth
                        value={maxPriceFilter || ''}
                        onChange={handleMaxPriceFilterChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Filter by category id"
                        type="number"
                        fullWidth
                        value={categoryIdFilter || ''}
                        onChange={handleCategoryIdFilterChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={fetchFilteredProducts}>
                        Filter
                    </Button>
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>
                Filtered Products:
            </Typography>
            <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} key={product.id}>
                        <Typography variant="h6">{product.title}</Typography>
                        <Typography variant="body1">Price: {product.price}</Typography>
                        <Typography variant="body1">Description: {product.description}</Typography>
                        <Typography variant="body1">Category: {product.category.name}</Typography>
                        <Typography variant="body1">Images:</Typography>
                        <Grid container spacing={1}>
                            {product.images.map((image: string) => (
                                <Grid item xs={4} key={image}>
                                    <img src={image} alt="Product" style={{ width: '100%' }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
export default FilterProductsComponent;