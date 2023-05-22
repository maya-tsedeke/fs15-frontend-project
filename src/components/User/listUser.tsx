import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { User } from '../../interface/types';
import { Edit, Visibility } from '@mui/icons-material';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userID, setUserID] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer',
    avatar: 'https://api.lorem.space/image/face?w=640&h=480&r=867', // Default avatar URL
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // Add state variables for update dialog
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [updatedUserName, setUpdatedUserName] = useState<string>('');
  const [updatedUserEmail, setUpdatedUserEmail] = useState<string>('');
  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('https://api.escuelajs.co/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleViewUser = (id: number) => {
    setUserID(id.toString());
    setViewDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setUserID('');
    setSelectedUser(null);
  };
  const handleFetchUser = async () => {
    try {
      const response = await axios.get<User>(`https://api.escuelajs.co/api/v1/users/${userID}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };
  const handleUserIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserID(event.target.value);
  };
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewUser({
      email: '',
      password: '',
      name: '',
      role: 'customer',
      avatar: 'https://api.lorem.space/image/face?w=640&h=480&r=867', // Reset to default avatar URL
    });
    setIsCreatingUser(false);
  };
  const handleNewUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleCreateUser = async () => {
    try {
      setIsCreatingUser(true);
      // Verify if email is available
      const emailAvailabilityResponse = await axios.post<{ isAvailable: boolean }>(
        'https://api.escuelajs.co/api/v1/users/is-available',
        { email: newUser.email }
      );

      const { isAvailable } = emailAvailabilityResponse.data;
      if (isAvailable) {
        // Email is already registered
        alert('Email is already registered.');
        setIsCreatingUser(false);
        return;
      }
      // Send the new user data to the server
      const response = await axios.post<User>('https://api.escuelajs.co/api/v1/users', newUser);
      // Add the new user to the existing list of users
      setUsers((prevUsers) => [...prevUsers, response.data]);
      // Close the create user dialog
      handleCreateDialogClose();
    } catch (error) {
      console.log('Error creating user:', error);
    } finally {
      setIsCreatingUser(false);
    }
  };
  //Update User
  const handleOpenUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setUpdatedUserName(user.name);
    setUpdatedUserEmail(user.email);
    setUpdateDialogOpen(true);
  };
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedUser(null);
    setUpdatedUserName('');
    setUpdatedUserEmail('');
  };
  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
      const updatedUser = {
        name: updatedUserName,
        email: updatedUserEmail,
      };
      await axios.put(
        `https://api.escuelajs.co/api/v1/users/${selectedUser.id}`,
        updatedUser
      );
      handleCloseUpdateDialog();
      fetchUsers(); // Refetch the updated user list
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };
  return (
    <div style={{ overflowX: 'auto' }}>'
      <Button variant="outlined" color="primary" onClick={handleCreateDialogOpen}>
        Create User
      </Button>
      <Typography variant="h4" gutterBottom>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1' }}>Categories List</div>
          <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateDialogOpen} >
              Create User
            </Button>
          </div>
        </div>
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <img
                  src={user.avatar}
                  alt={`Avatar for ${user.name}`}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              {!isSmallScreen && <TableCell>{user.email}</TableCell>}
              {!isSmallScreen && <TableCell>{user.role}</TableCell>}
              <TableCell>
                <IconButton onClick={() => handleViewUser(user.id)} title="View">
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleOpenUpdateDialog(user)} title="Update">
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog}>
        {selectedUser ? (
          <>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
              <img
                src={selectedUser.avatar}
                alt={`Avatar for ${selectedUser.name}`}
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Enter User ID</DialogTitle>
            <DialogContent>
              <TextField label="User ID" value={userID} onChange={handleUserIDChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleFetchUser} color="primary">
                Fetch User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Avatar"
              name="avatar"
              value={newUser.avatar}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary" disabled={isCreatingUser}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {/*Update Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={updatedUserName}
            onChange={(e) => setUpdatedUserName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={updatedUserEmail}
            onChange={(e) => setUpdatedUserEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default UserList;
