import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProductAction, deleteProductAction, getProductsAction, updateProductAction } from '../../actions/productActions';
import { RootState } from '../../store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import {
  FormControl,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  Button,
  Modal,
  Typography,
  IconButton,
} from '@mui/material';
import { Product } from '../../types/productTypes';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import { Visibility } from '@mui/icons-material';
import { Delete, Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  productList: {
    marginTop: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: theme.spacing(2),
  },
  productItem: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
  },
  productTitle: {
    marginBottom: theme.spacing(1),
  },
  productDescription: {
    marginBottom: theme.spacing(2),
  },
  productPrice: {
    fontWeight: 'bold',
  },
  productImage: {
    marginBottom: theme.spacing(2),
  },
  category: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  categoryImage: {
    width: '50px',
    height: '50px',
    marginRight: theme.spacing(2),
    borderRadius: '50%',
  },
  filters: {
    marginBottom: theme.spacing(2),
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(2, 1fr))',
    gridGap: theme.spacing(2),
  },
  filterTextField: {
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%',
    minWidth: '180px',
    marginLeft: theme.spacing(2),
  },
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    outline: 'none',
    width: '600px',
  },
  modalTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  modalTextField: {
    marginBottom: theme.spacing(6),
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  warningModalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    color: '#fff',
    outline: 'none',
  },
  deleteButton: {
    marginRight: theme.spacing(2),
  },
}));

function ProductList() {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const classes = useStyles();
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.products.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [sortCategory, setSortCategory] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [imageUrls, setImageUrls] = useState([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const openCreateModal = () => {
    setIsEdit(false); // Set isEdit flag to false when opening create modal
    setCreateModalOpen(true);
  };

  const openEditModal = (productId: number) => {
    setIsEdit(true); // Set isEdit flag to true when opening edit modal
    setEditProductId(productId); // Set the product ID being edited
    setCreateModalOpen(true);
  };
  const openDeleteConfirmation = (productId: number) => {
    setShowDeleteConfirmation(true);
    setDeleteProductId(productId);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setIsEdit(false); // Reset isEdit flag when closing the modal
    setTitle('');
    setPrice(0);
    setDescription('');
    setCategoryId(0);
    setSelectedCategory(0);
    setImageUrls([]);
  };
  useEffect(() => {
    // Fetch and bind existing data when editing a product
    if (isEdit && editProductId !== null) {
      const productToEdit = products.products.find((product: Product) => product.id === editProductId);
      if (productToEdit) {
        setTitle(productToEdit.title);
        setPrice(productToEdit.price);
        setDescription(productToEdit.description);
        setCategoryId(productToEdit.category.id);
      }
    }
  }, [isEdit, editProductId, products.products]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    price: '',
    productName: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const uniqueCategories = new Set();
  // const isAdmin = useSelector((state: RootState) => state.user.success); // Assuming you have a isAdmin state in your authentication reducer
  const isAdmin = sessionStorage.getItem('accessToken') !== null; // Check if the user is logged in 
  useEffect(() => {
    dispatch(getProductsAction())
      .then(() => {
        console.log('Products action dispatched successfully');
      })
      .catch((error) => {
        console.log('Error dispatching products action:', error);
      });
  }, [dispatch]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    setIsFiltering(true);
  };

  const handleCancel = () => {
    setIsFiltering(false);
    setSortCategory('');
    setSortPrice('');
  };


  const confirmDelete = () => {
    // Send a DELETE request to the server to delete the product
    if (isAdmin && deleteProductId) {
      dispatch(deleteProductAction(deleteProductId))
        .then(() => {
          console.log('Product deleted successfully');
        })
        .catch((error: any) => {
          console.log('Error deleting product:', error);
        });
    } else {
      console.log('You do not have permission to delete this product');
    }

    // Close the delete confirmation modal
    closeDeleteConfirmation();
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };
  const handleAddToCart = (productId: number) => {
    // Add the product to the cart
    // Implement your own cart functionality here
    console.log(`Product ${productId} added to cart`);
  };
  const data = Array.from(products.products);
  const applyFilters = () => {
    const filteredData = data.filter((product: any) => {
      if (filters.category && product.category.name !== filters.category) {
        return false;
      }
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split('-');
        if (minPrice && parseFloat(product.price) < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice && parseFloat(product.price) > parseFloat(maxPrice)) {
          return false;
        }
      }
      if (filters.price && parseFloat(product.price) !== parseFloat(filters.price)) {
        return false;
      }
      if (filters.productName && !product.title.toLowerCase().includes(filters.productName.toLowerCase())) {
        return false;
      }
      return true;
    });

    let sortedData = [...filteredData];

    if (sortCategory) {
      sortedData.sort((a, b) => a.category.name.localeCompare(b.category.name));
    }
    if (sortPrice === 'asc') {
      sortedData.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortPrice === 'desc') {
      sortedData.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));
    }
    return sortedData;
  };
  const getPageProducts = () => {
    const filteredData = applyFilters();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  // Update the onChange handler for the category select input
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
  };
  const createProduct = async () => {
    try {
      // Create a new product object using the values from the input fields
      const productData = {
        title: title,
        price: price,
        description: description,
        categoryId: categoryId,
        images: imageUrls,
        category: {
          id: 0,
          name: '',
          image: 'https://placeimg.com/640/480/any',
        },
        id: 0, // Generate a unique ID for the product
      };
      // Dispatch the createProductAction with the productData
      dispatch(createProductAction(productData));
      // Refresh the product list after successful creation
      dispatch(getProductsAction());
      // Close the create dialog
      setCreateModalOpen(false);

      // Clear the input fields
      setTitle('');
      setPrice(0);
      setDescription('');
      setCategoryId(0);
      setSelectedCategory(0);
      setImageUrls([]);
      // Display the response data
      console.log('Created product:', productData);
    } catch (error) {
      console.log('Error creating product:', error);
    }
  };
  const handleUpdate = () => {
    if (editProductId !== null) {
      const updatedProduct = {
        id: editProductId,
        title,
        price,
        description,
        categoryId,
        images: ['https://placeimg.com/640/480/any'],
        category: {
          id: 0,
          name: '',
          image: 'https://placeimg.com/640/480/any',
        },
      };
      dispatch(updateProductAction(updatedProduct.id, updatedProduct));
      setCreateModalOpen(false);
    }
  };
  const handleImageUrlsChange = (event: any) => {
    const urls = event.target.value.split('\n');
    setImageUrls(urls);
  };
  return (
    <>
      <h1>Product List &nbsp; &nbsp;
        <Button variant="outlined" onClick={openCreateModal} startIcon={<AddCircleOutlineIcon />}>Create Product</Button>
      </h1>{isFiltering ? (
        <>
          <div className={classes.filtersContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="category"
                  select
                  label="Category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  variant="outlined"
                  className={classes.filterTextField}
                >
                  {Array.from(new Set(data.map((product) => product.category.name))).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="priceRange"
                  label="Min Price"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  variant="outlined"
                  className={classes.filterTextField}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="price"
                  label="Price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  variant="outlined"
                  className={classes.filterTextField}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="productName"
                  label="Product Name"
                  value={filters.productName}
                  onChange={handleFilterChange}
                  variant="outlined"
                  className={classes.filterTextField}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleCancel} sx={{ mr: 2, width: 100 }}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <Button variant="contained" onClick={handleFilter} sx={{ mr: 2 }}>
              Filter
            </Button>
          </div>
        </>
      )}
      <div className={classes.productList}>
        {products && products.products.length > 0 ? (
          getPageProducts().map((product) => (
            <div key={product.id} className={classes.productItem}>
              <h2 className={classes.productTitle}>{product.title}</h2>
              <p className={classes.productDescription}>{product.description}</p>
              <p className={classes.productPrice}>Price: ${product.price}</p>
              <div className={classes.productImage}>
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${product.id} Image ${index + 1}`}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                ))}
              </div>
              <div className={classes.category}>
                <img
                  className={classes.categoryImage}
                  src={product.category.image}
                  alt={`Category ${product.category.id} Image`}
                />
                <h3>{product.category.name}</h3>
              </div>

              <IconButton onClick={() => openModal(product)} sx={{ mr: 2 }} title="View">
                <Visibility />
              </IconButton>
              {isAdmin && (
                <>
                  <IconButton
                    title="Delete"
                    onClick={() => openDeleteConfirmation(product.id)}
                    sx={{ mr: 2 }} >
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => openEditModal(product.id)} sx={{ mr: 2 }} title="Update">
                    <Edit />
                  </IconButton>
                </>
              )}
            </div>
          ))
        ) : (
          <Typography variant="h5">No products found</Typography>
        )}
        <Modal open={showDeleteConfirmation} onClose={closeDeleteConfirmation}>
        <div className={classes.warningModalContainer}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <Button onClick={confirmDelete}>Delete</Button>
            <Button onClick={closeDeleteConfirmation}>Cancel</Button>
          </div>
        </Modal>
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChangePage}
        color="primary" />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className={classes.modalContainer}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className={classes.modalContent}>
          {selectedProduct && (
            <>
              <h2 className={classes.modalTitle} id="modal-title">
                {selectedProduct.title}
              </h2>
              <p className={classes.productDescription}>{selectedProduct.description}</p>
              <p className={classes.productPrice}>Price: ${selectedProduct.price}</p>
              <div className={classes.productImage}>
                {selectedProduct.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${selectedProduct.id} Image ${index + 1}`}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                ))}
              </div>
              <div className={classes.category}>
                <img
                  className={classes.categoryImage}
                  src={selectedProduct.category.image}
                  alt={`Category ${selectedProduct.category.id} Image`}
                />
                <h3>{selectedProduct.category.name}</h3>
              </div>
              <div className={classes.modalButtons}>
                <Button
                  variant="contained"
                  onClick={() => handleAddToCart(0)}
                  sx={{ mr: 2 }} >
                  Add to Cart
                </Button>
                <Button variant="contained" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        className={classes.modalContainer}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description" >
        <div className={classes.modalContent}>
          <Typography variant="h5" id="create-modal-title">
            {isEdit ? 'Edit Product' : 'Create Product'}
          </Typography>
          <FormControl fullWidth>
            <TextField
              label="Title"
              variant="outlined"
              className={classes.modalTextField}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>
          <pre></pre>
          <FormControl fullWidth>
            <TextField
              label="Price"
              variant="outlined"
              className={classes.modalTextField}
              value={price}
              onChange={(event: any) => setPrice(event.target.value)}
            />
          </FormControl>
          {!isEdit && (
            <><pre></pre><FormControl fullWidth>
              <TextField
                label="Description"
                variant="outlined"
                className={classes.modalTextField}
                value={description}
                onChange={(event) => setDescription(event.target.value)} />  </FormControl><pre></pre><FormControl fullWidth>
                <TextField
                  label="Image URLs"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={imageUrls.join('\n')}
                  onChange={handleImageUrlsChange} />  </FormControl><pre></pre>

              <FormControl fullWidth>
                <TextField
                  label="Category"
                  variant="outlined"
                  select
                  className={classes.modalTextField}
                  value={selectedCategory}
                  onChange={handleCategoryChange} // Bind the onChange event to handleCategoryChange
                >
                  {/* Populate options with product categories */}
                  {data.map((product) => {
                    const categoryName = product.category.name;
                    if (!uniqueCategories.has(categoryName)) {
                      uniqueCategories.add(categoryName);
                      return (
                        <MenuItem key={product.category.id} value={product.category.id}>
                          {categoryName}
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </TextField>
              </FormControl> </>)}
          <pre></pre>
          <Button variant="contained"
            onClick={isEdit ? handleUpdate : createProduct}
            startIcon={<SaveIcon />}
            sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="contained" onClick={closeCreateModal} sx={{ mr: 2 }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
export default ProductList;
