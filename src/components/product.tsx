import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Product } from '../interface/types';

const ProductComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(6);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [maxOffset, setMaxOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [updatedProductTitle, setUpdatedProductTitle] = useState<string>('');
  const [updatedProductPrice, setUpdatedProductPrice] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // Add state variables for create dialog
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newProductTitle, setNewProductTitle] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductDescription, setNewProductDescription] = useState<string>('');
  const [newProductCategoryId, setNewProductCategoryId] = useState<number>(0);
  const [newProductImageUrl, setNewProductImageUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  //Response
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [response, setResponse] = useState<Product | null>(null);

  useEffect(() => {
    fetchTotalCount();
    fetchProducts();
  }, [offset]);

  const fetchTotalCount = async () => {
    try {
      const url = 'https://api.escuelajs.co/api/v1/products';
      const params: { [key: string]: any } = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.get<Product[]>(url, params);
      const totalCount = response.data.length;
      const calculatedMaxOffset = Math.ceil(totalCount / limit) * limit;
      setMaxOffset(calculatedMaxOffset);
    } catch (error) {
      console.log('Error fetching total count:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
  
      // Construct the URL with the offset, limit, and price range filter
      let url = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`;
      console.log("URL: ",url)
      const response = await axios.get<Product[]>(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };
  const handleNextPage = () => {
    if (!loading && offset < maxOffset) {
      setOffset(offset + limit);
    }
  };
  const handleViewProduct = async (productId: number) => {
    try {
      const response = await axios.get<Product>(
        `https://api.escuelajs.co/api/v1/products/${productId}`
      );
      const singleProduct = response.data;
      setSelectedProduct(singleProduct);
      setUpdatedProductTitle(singleProduct.title);
      setUpdatedProductPrice(singleProduct.price);
    } catch (error) {
      console.log('Error fetching single product:', error);
    }
  };
  const handleOpenUpdateDialog = (product: Product) => {
    setSelectedProduct(product);
    setUpdatedProductTitle(product.title);
    setUpdatedProductPrice(product.price);
    setUpdateDialogOpen(true);
  };
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setUpdatedProductTitle('');
    setUpdatedProductPrice(0);
    handleCloseDialog();
  };
  const handleUpdateProduct = async () => {
    try {
      if (selectedProduct) {
        const { id } = selectedProduct;
        if (updatedProductTitle && updatedProductPrice !== null) {
          // Create an updated product object
          const updatedProduct: Partial<Product> = {
            title: updatedProductTitle,
            price: updatedProductPrice,
          };
          // Send the updated product data to the API
          await axios.put<Product>(`https://api.escuelajs.co/api/v1/products/${id}`, updatedProduct);
          // Refresh the product list after successful update
          fetchProducts();
          handleCloseUpdateDialog();
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.log('Error updating product:', error);
    }
  };
  const handleDeleteProduct = async (productId: number) => {
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`);
      fetchProducts();
      handleCloseDeleteDialog();
    } catch (error) {
      console.log('Error deleting product:', error);
    }
  };
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };
  const handleUpdateProductTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProductTitle(event.target.value);
  };
  const handleUpdateProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProductPrice(parseFloat(event.target.value));
  };
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    handleCloseDialog();
  };
  const handleConfirmDeleteProduct = async () => {
    if (selectedProduct) {
      const { id } = selectedProduct;
      await handleDeleteProduct(id);
      handleCloseDeleteDialog();
    }
  };
  // Handle create function
  const handleCreateProduct = async () => {
    try {
      // Create a new product object using the values from the input fields
      const newProduct = {
        title: newProductTitle,
        price: newProductPrice,
        description: newProductDescription,
        categoryId: newProductCategoryId,
        images: [newProductImageUrl]
      };
  
      // Send the new product data to the API
      const response = await axios.post<Product>('https://api.escuelajs.co/api/v1/products/', newProduct);
  
      // Refresh the product list after successful creation
      fetchProducts();
  
      // Close the create dialog
      setCreateDialogOpen(false);
      setResponse(response.data);
      setResponseDialogOpen(true);
      // Clear the input fields
      setNewProductTitle('');
      setNewProductPrice(0);
      setNewProductDescription('');
      setNewProductCategoryId(0);
      setNewProductImageUrl('');
        // Display the response data
    console.log('Created product:', response.data);
    } catch (error) {
      console.log('Error creating product:', error);
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewProductTitle('');
    setNewProductPrice(0);
    setNewProductDescription('');
    setNewProductCategoryId(0);
    setNewProductImageUrl('');
    setErrorMessage('');
  };

  const handleNewProductTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductTitle(event.target.value);
  };

  const handleNewProductPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductPrice(parseFloat(event.target.value));
  };

  const handleNewProductDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductDescription(event.target.value);
  };

  const handleNewProductCategoryIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductCategoryId(parseInt(event.target.value, 10));
  };

  const handleNewProductImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewProductImageUrl(event.target.value);
  };
  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
    setResponse(null);
  };
  return (
    <Container>
<Typography variant="h4" gutterBottom>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>Product List</div>
    <Button
  variant="contained"
  color="primary"
  onClick={() => setCreateDialogOpen(true)}
  style={{ marginLeft: 'auto' }}
>
  Create Product
</Button>
  </div>
</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Typography variant="h6">{product.title}</Typography>
            <Typography variant="body1">Price: ${product.price}</Typography>
            <Typography variant="body2">{product.description}</Typography>
            <div>
              {product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={`Product ${product.id} - Image 1`}
                  style={{ width: '100%', marginTop: '10px' }} />
              )}
            </div>

            <IconButton onClick={() => handleViewProduct(product.id)} title="View">
              <Visibility />
            </IconButton>
            <IconButton onClick={() => handleOpenUpdateDialog(product)} title="Update">
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleOpenDeleteDialog(product)}
              title="Delete">
              <Delete />
            </IconButton>
          </Grid>
        ))}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" onClick={handlePrevPage} disabled={offset === 0}>
          Previous Page
        </Button>
        <Button variant="contained" onClick={handleNextPage} disabled={offset >= maxOffset || loading}>
          Next Page ({maxOffset})
        </Button>
      </div>
      <Dialog open={!!selectedProduct} onClose={handleCloseDialog}>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">Price: ${selectedProduct.price}</Typography>
              <Typography variant="body2">{selectedProduct.description}</Typography>
              <div>
                {selectedProduct.images.map((image, index) => (
                  <img
                    src={image}
                    alt={`Product ${selectedProduct.id} - Image ${index + 1}`}
                    key={index}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={updatedProductTitle}
            onChange={handleUpdateProductTitleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={updatedProductPrice}
            onChange={handleUpdateProductPriceChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateProduct}>Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteProduct} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <TextField label="Title" value={newProductTitle} onChange={handleNewProductTitleChange} fullWidth margin="normal" />
<TextField label="Price" value={newProductPrice} onChange={handleNewProductPriceChange} type="number" fullWidth margin="normal" />
<TextField label="Description" value={newProductDescription} onChange={handleNewProductDescriptionChange} fullWidth margin="normal" />
<TextField
         label="Category ID"
         value={newProductCategoryId}
         onChange={handleNewProductCategoryIdChange}
         type="number"
         fullWidth
         margin="normal"
       />
<TextField
  label="Image URL"
  value={newProductImageUrl}
  onChange={handleNewProductImageUrlChange}
  fullWidth
  margin="normal"
/>
 {/* Display error message if it exists */}
 {errorMessage && (
      <Typography color="error" gutterBottom>
        {errorMessage}
      </Typography>
    )}
</DialogContent>

<DialogActions>
<Button onClick={handleCloseCreateDialog} color="primary">
Cancel
</Button>
<Button onClick={handleCreateProduct} color="primary">
Create
</Button>
</DialogActions>
</Dialog>
<Dialog open={responseDialogOpen} onClose={handleCloseResponseDialog}>
  <DialogTitle>Response: The following data was created </DialogTitle>
  <DialogContent>
    <Typography variant="body1">Title: {response?.title}</Typography>
    <Typography variant="body1">Price: {response?.price}</Typography>
    <Typography variant="body1">Description: {response?.description}</Typography>
    <Typography variant="body1">Images: {response?.images.join(', ')}</Typography>
    {response?.category && (
      <div>
        <Typography variant="body1">Category ID: {response.category.id}</Typography>
        <Typography variant="body1">Category Name: {response.category.name}</Typography>
        <Typography variant="body1">Category Image: {response.category.image}</Typography>
        <Typography variant="body1">Category Creation At: {response.category.creationAt}</Typography>
        <Typography variant="body1">Category Updated At: {response.category.updatedAt}</Typography>
      </div>
    )}
    <Typography variant="body1">ID: {response?.id}</Typography>
    <Typography variant="body1">Creation At: {response?.creationAt}</Typography>
    <Typography variant="body1">Updated At: {response?.updatedAt}</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseResponseDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};
export default ProductComponent;
