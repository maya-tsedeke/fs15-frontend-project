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
import { Category, Product } from '../interface/types';

const CategoryComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  // Add state variables for create dialog and view dialog
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  // Add state variable for the category ID
  const [categoryId, setCategoryId] = useState<number>(0);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Construct the URL with the offset and limit
      let url = `https://api.escuelajs.co/api/v1/categories`;
      const response = await axios.get<Category[]>(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProductsByCategory = async (catId: number) => {
    try {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/categories/${catId}/products`
      );
      const products = response.data;
      // Process the products data as needed
      console.log(products);
      setProducts(products); // Set the fetched products to the state variable
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };
  const handleViewCategory = async (catId: number) => {
    try {
      const response = await axios.get<Category>(
        `https://api.escuelajs.co/api/v1/categories/${catId}`
      );
      const singleCategory = response.data;
      setSelectedCategory(singleCategory);
      fetchProductsByCategory(catId); // Fetch the products for the selected category
      setViewDialogOpen(true); // Open the view dialog
    } catch (error) {
      console.log('Error fetching single category:', error);
    }
  };
  // Function to handle submitting the category ID
  const handleSubmitCategoryId = () => {
    handleViewCategory(categoryId);
  };
  const handleOpenUpdateDialog = (category: Category) => {
    setSelectedCategory(category);
    setUpdatedCategoryName(category.name);
    setUpdateDialogOpen(true);
  };
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedCategory(null);
    setUpdatedCategoryName('');
  };
  const handleUpdateCategory = async () => {
    try {
      if (!selectedCategory) return;
      const updatedCategory = { ...selectedCategory, name: updatedCategoryName };
      await axios.put(
        `https://api.escuelajs.co/api/v1/categories/${selectedCategory.id}`,
        updatedCategory
      );

      handleCloseUpdateDialog();
      fetchCategories();
    } catch (error) {
      console.log('Error updating category:', error);
    }
  };
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewCategoryName('');
  };
  const handleCreateCategory = async () => {
    try {
      const newCategory = {
        name: newCategoryName,
        image: "https://placeimg.com/640/480/any" // Add the image URL
      };

      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/categories/",
        newCategory
      );
      const createdCategory = response.data;
      console.log("Created: ", createdCategory)
      handleCloseCreateDialog();
      fetchCategories();
    } catch (error) {
      console.log("Error creating category:", error);
    }
  };
  const handleOpenDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };
  const handleDeleteCategory = async () => {
    try {
      if (!selectedCategory) return;
      await axios.delete(
        `https://api.escuelajs.co/api/v1/categories/${selectedCategory.id}`
      );
      handleCloseDeleteDialog();
      fetchCategories();
    } catch (error) {
      console.log('Error deleting category:', error);
    }
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1' }}>Categories List</div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateDialogOpen(true)}
            style={{ marginLeft: '16px' }}
          >
            Create Category
          </Button>
          <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Category ID"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              style={{ marginRight: '8px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitCategoryId}
            >
              Single View by ID
            </Button>
          </div>
        </div>
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Typography variant="h6">{category.name}</Typography>
            <Typography variant="body1">ID: {category.id}</Typography>
            <div>
              {category.image.length > 0 && (
                <img
                  src={category.image}
                  alt={`Product ${category.id} - Image 1`}
                  style={{ width: '100%', marginTop: '10px' }} />
              )}
            </div>
            <IconButton onClick={() => handleViewCategory(category.id)} title="View">
              <Visibility />
            </IconButton>
            <IconButton onClick={() => handleOpenUpdateDialog(category)} title="Update">
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleOpenDeleteDialog(category)}
              title="Delete">
              <Delete />
            </IconButton>
          </Grid>
        ))}
      </Grid>
      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateCategory} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button onClick={handleCreateCategory} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {/* View Dialog */}
      {selectedCategory && (
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
          <DialogTitle>View Category</DialogTitle>
          <DialogContent>
            <Typography variant="h5">{selectedCategory.name}</Typography>
            <div>
              {Array.isArray(selectedCategory.image) ? (
                selectedCategory.image.map((image, index) => (
                  <img
                    src={image}
                    alt={`Category ${selectedCategory.id} - Image ${index + 1}`}
                    key={index}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                ))
              ) : (
                <img
                  src={selectedCategory.image}
                  alt={`Category ${selectedCategory.id} - Image 1`}
                  style={{ width: '100%', marginTop: '10px' }}
                />
              )}
            </div>
            {/* Add code to display the products */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              <DialogTitle>View Products under this Category</DialogTitle>
            </Typography>
            {products.map((product) => (
              <div key={product.id}>
                <Typography variant="subtitle1">{product.title}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <div>
                  {product.images.map((image, index) => (
                    <img
                      src={image}
                      alt={`Product ${product.id} - Image ${index + 1}`}
                      key={index}
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCategory} variant="contained" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default CategoryComponent;