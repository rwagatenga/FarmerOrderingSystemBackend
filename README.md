# Agro-Input Store Management System

## System Overview

The Agro-Input Store Management System is designed to facilitate the buying and selling of fertilizers and seeds for farmers. The system automates the process of calculating fertilizer and seed quantities based on the size of the land owned by farmers. It also enables the Agro-Input store to manage orders, approve payments, and reject orders.

### System Process Flow

1. **Farmer Registration**: Farmers register on the platform providing necessary details such as name, contact information, and land size.

2. **Order Placement**: Farmers place orders for fertilizers and seeds specifying the land size and the type of seeds required.

3. **Auto Calculation**: Upon order placement, the system automatically calculates the required quantities of fertilizers and seeds based on the size of the land and the type of seeds chosen.

4. **Order Approval**: The Agro-Input store receives the orders and has the option to approve them when fully paid in cash or reject them.

### Business Rules

- Fertilizer Quantity: Should not exceed 3kg on a land size of 1 acre.
- Seed Quantity: Should not exceed 1kg per 1 acre of land.
- Listing: By default, any listing should not exceed 5 records per page and should be sorted alphabetically.

## Technologies Used

### Backend

- **Running Environment**: Node.js
- **Language**: TypeScript
- **Database**: MongoDB or PostgreSQL
- **Framework**: Express.js

## Running the Application

1. Clone the repository from [GitHub Repo](https://github.com/rwagatenga/agro-input-store).
2. Navigate to the project directory.
3. install `nvm install` then `nvm use 20`
4. Install dependencies using `npm install`.
5. Set up the environment variables such as database connection details and server port in a `.env` file.
6. Start the server using `npm start`.
7. Access the application through the specified port in the browser or using API testing tools like Postman.

## Running Scripts

To maintain code quality and facilitate development, several npm scripts are provided. These scripts automate tasks such as code formatting, linting, building, and testing.

### Code Formatting

- **Check Formatting**: Verify if the code adheres to the defined formatting standards.

  ```bash
  npm run format:check
  ```

- **Format Code**: Automatically format the code according to the defined standards.
  ```bash
  npm run format
  ```

### Build

- **Prebuild**: Clean the `dist` directory before building.

  ```bash
  npm run prebuild
  ```

- **Build**: Transpile TypeScript code to JavaScript and generate the `dist` directory.
  ```bash
  npm run build
  ```

### Development

- **Start Development Server**: Run the application in development mode with hot reloading.
  ```bash
  npm run dev
  ```

### Linting

- **Lint Code**: Check the code for potential errors and adherence to coding standards.

  ```bash
  npm run lint
  ```

- **Lint Code and Fix**: Automatically fix linting errors where possible.
  ```bash
  npm run lint:fix
  ```

### Testing

- **Run Tests**: Execute unit tests for the application.
  ```bash
  npm test
  ```
  <b>N.B:</b> The tests are not yet fully functioning due to shortage of time. <br />
  w
  The provided scripts help maintain code quality, automate repetitive tasks, and ensure consistency throughout the development process. Use them regularly to enhance productivity and reliability.

## Additional Notes

- Ensure that Node.js and MongoDB/PostgreSQL are installed on your system before running the application.
- Consider implementing authentication and authorization mechanisms for secure access to the system.
- Regularly back up the database to prevent data loss in case of system failures.

## Contributors

- [Fred Rwagatenga](https://github.com/rwagatenga)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
