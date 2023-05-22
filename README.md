# Frontend Project using React UI material
This is a frontend project created using React UI Material.
This project aims to provide a user-friendly interface for browsing and managing products. It utilizes the React UI Material library to create a visually appealing and responsive design.

Fetch, display, create,and update for product and user from the given API endpoint, using React and TypeScript.
[Click here to see the Demo ](https://maya-tsedeke.github.io/fs15_8-breweries-app/).
![demo1](ss.png)
This project is a React app that allows users to search for product by price range, product name, or category. It fetches ecomerce data from the Open Platzi Fake Store API using Axios and displays it in a table with pagination and links to ecommerce websites. Users can also view single the row by ID columns.
## Demo

A live demo of the project is available at [Demo URL](https://maya-tsedeke.github.io/fs15_frontend-project/).
## Features

- Display a list of products with their details, including title, price, description, category, and images.
- Filter products by title, price, price range, and category.
- Pagination to navigate through a large number of products.
- Create new products with title, price, description, category, and images.
- Update existing products by modifying their attributes.
- Delete products to remove them from the system.
## Technologies Used
1. React
2. Axios
3. Material-UI
## Installation Instructions
To run the project on your local machine, follow these steps:

1. Clone the repository to your machine using git clone.
2. Install dependencies by running npm install.
3. Start the development server by running npm start.
## Usage
To use the app, follow these steps:

1. Login: Start by logging into the app using your credentials.

2. Sidebar Menu: After logging in, you will see a list of sidebar menus on the screen.

3. Expand Menu: To view the full contents of a menu, click on the expand button associated with that menu This will reveal all the sub-menus and options available within it.

By following these steps, you will be able to navigate and access the various features and functionalities of the app.
## Backend API lists that was included in this project task

The project integrates with a backend API to fetch and manage product data. Here are the available endpoints:

### Products

- Get all products: [GET] https://api.escuelajs.co/api/v1/products
- Get a single product: [GET] https://api.escuelajs.co/api/v1/products/{id}
- Create a product: [POST] https://api.escuelajs.co/api/v1/products/
- Update a product: [PUT] https://api.escuelajs.co/api/v1/products/{id}
- Delete a product: [DELETE] https://api.escuelajs.co/api/v1/products/{id}
- Filter products by title, price, price range, and category.

### Categories

- Get all categories: [GET] https://api.escuelajs.co/api/v1/categories
- Get a single category: [GET] https://api.escuelajs.co/api/v1/categories/{id}
- Create a category: [POST] https://api.escuelajs.co/api/v1/categories/
- Update a category: [PUT] https://api.escuelajs.co/api/v1/categories/{id}
- Delete a category: [DELETE] https://api.escuelajs.co/api/v1/categories/{id}
- Get all products by category: [GET] https://api.escuelajs.co/api/v1/categories/{categoryID}/products

### Users

- Get all users: [GET] https://api.escuelajs.co/api/v1/users
- Get a single user: [GET] https://api.escuelajs.co/api/v1/users/{id}
- Create a user: [POST] https://api.escuelajs.co/api/v1/users/
- Update a user: [PUT] https://api.escuelajs.co/api/v1/users/{id}

## Installation

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/maya-tsedeke/fs15_frontend-project.git`
2. Install the dependencies: `npm install`
3. Start the development server: `npm start`
4. Open the project in your browser at `http://localhost:3000`

## Contributing Guidelines
If you would like to contribute to the project, please follow these guidelines:
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them with clear commit messages.
4. Push your changes to your fork.
5. Create a pull request from your fork to the main repository.
# License
This project is licensed under the MIT License.

# Acknowledgments
1. Open Brewery DB API
2. Material-UI
## Contact Information
If you have any questions, issues, or feedback about the project, please contact me at [infosignal2@gmail.com].