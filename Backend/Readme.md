# User Registration Endpoint

## Endpoint: `/users/register`

### Method: POST

### Description:
This endpoint is used to register a new user. It validates the input data, hashes the user's password, creates a new user in the database, and returns a JSON response containing the user object and a JWT token.

### Request Body:
The request body should be a JSON object with the following fields:
- `fullname`: An object containing:
  - `firstname`: A string with a minimum length of 3 characters (required).
  - `lastname`: A string with a minimum length of 3 characters (optional).
- `email`: A valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).
- `usertype`: A choice box or radio button(string) with values 'donor' or 'volunteer' (required)

Example:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "userType": "donor"
}
```

### Example Response:
- `user` (object):
    - `fullname` (object):
        - `firstname` (String): User's firstname (minimum 3 characters),
        - `lastname` (String): User's lastname (minimum 3 characters),
    - `email` (String): User's email address (must be a valid email),
    - `password` (String): User's password (minimum 6 characters),
    - `userType` (String): User type (donor or volunteer)
- `token` (String): JWT Token

# User Login Endpoint

## Endpoint: `/users/login`

### Method: POST

### Description:
This endpoint is used to log in a user. It validates the input data, checks the user's credentials, and returns a JSON response containing the user object and a JWT token.

### Request Body:
The request body should be a JSON object with the following fields:
- `email`: A valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Example Response:
- `user` (object):
    - `fullname` (object):
        - `firstname` (String): User's firstname (minimum 3 characters),
        - `lastname` (String): User's lastname (minimum 3 characters),
    - `email` (String): User's email address (must be a valid email),
    - `userType` (String): User type (donor or volunteer)
- `token` (String): JWT Token

# User Profile Endpoint

## Endpoint: `/users/profile`

### Method: GET

### Description:
This endpoint is used to get the profile of the logged-in user. It requires authentication.

### Example Response:
- `user` (object):
    - `fullname` (object):
        - `firstname` (String): User's firstname (minimum 3 characters),
        - `lastname` (String): User's lastname (minimum 3 characters),
    - `email` (String): User's email address (must be a valid email),
    - `userType` (String): User type (donor or volunteer)

# User Logout Endpoint

## Endpoint: `/users/logout`

### Method: GET

### Description:
This endpoint is used to log out the user. It requires authentication.

### Example Response:
- `message` (String): "Logged out"

# Organization Registration Endpoint

## Endpoint: `/orgs/registerOrg`

### Method: POST

### Description:
This endpoint is used to register a new organization. It validates the input data, hashes the organization's password, creates a new organization in the database, and returns a JSON response containing the organization object and a JWT token.

### Request Body:
The request body should be a JSON object with the following fields:
- `organizationName`: A string with a minimum length of 3 characters (required).
- `organizationType`: A choice box or radio button(string) with values 'hotel', 'NGO', 'non-profit', 'social service' (required).
- `address`: A string with a minimum length of 3 characters (required).
- `contactPerson`: A string with a minimum length of 3 characters (required).
- `contactNumber`: A string with a minimum length of 10 characters (required).
- `email`: A valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).

Example:
```json
{
  "organizationName": "Helping Hands",
  "organizationType": "NGO",
  "address": "123 Charity Lane",
  "contactPerson": "Jane Doe",
  "contactNumber": "1234567890",
  "email": "contact@helpinghands.org",
  "password": "securepassword"
}
```

### Example Response:
- `organization` (object):
    - `organizationName` (String): Organization's name (minimum 3 characters),
    - `organizationType` (String): Organization type (hotel, NGO, non-profit, social service),
    - `address` (String): Organization's address (minimum 3 characters),
    - `contactPerson` (String): Contact person's name (minimum 3 characters),
    - `contactNumber` (String): Contact number (minimum 10 characters),
    - `email` (String): Organization's email address (must be a valid email),
    - `password` (String): Organization's password (minimum 6 characters)
- `token` (String): JWT Token

# Organization Login Endpoint

## Endpoint: `/orgs/loginOrg`

### Method: POST

### Description:
This endpoint is used to log in an organization. It validates the input data, checks the organization's credentials, and returns a JSON response containing the organization object and a JWT token.

### Request Body:
The request body should be a JSON object with the following fields:
- `email`: A valid email address (required).
- `password`: A string with a minimum length of 6 characters (required).

Example:
```json
{
  "email": "contact@helpinghands.org",
  "password": "securepassword"
}
```

### Example Response:
- `organization` (object):
    - `organizationName` (String): Organization's name (minimum 3 characters),
    - `organizationType` (String): Organization type (hotel, NGO, non-profit, social service),
    - `address` (String): Organization's address (minimum 3 characters),
    - `contactPerson` (String): Contact person's name (minimum 3 characters),
    - `contactNumber` (String): Contact number (minimum 10 characters),
    - `email` (String): Organization's email address (must be a valid email),
    - `password` (String): Organization's password (minimum 6 characters)
- `token` (String): JWT Token
 
# Organization Profile Endpoint

## Endpoint: `/orgs/profile`

### Method: GET

### Description:
This endpoint is used to get the profile of the logged-in organization. It requires authentication.

### Example Response:
- `organization` (object):
    - `organizationName` (String): Organization's name (minimum 3 characters),
    - `organizationType` (String): Organization type (hotel, NGO, non-profit, social service),
    - `address` (String): Organization's address (minimum 3 characters),
    - `contactPerson` (String): Contact person's name (minimum 3 characters),
    - `contactNumber` (String): Contact number (minimum 10 characters),
    - `email` (String): Organization's email address (must be a valid email)

# Organization Logout Endpoint

## Endpoint: `/orgs/logout`

### Method: GET

### Description:
This endpoint is used to log out the organization. It requires authentication.

### Example Response:
- `message` (String): "Logged out"

# Donation Creation Endpoint

## Endpoint: `/donations/create`

### Method: POST

### Description:
This endpoint is used to create a new food donation. It requires authentication and supports multipart form data for image upload.

### Headers:
- `Authorization`: Bearer token (required)
- `Content-Type`: multipart/form-data

### Request Body:
The request body should be form data with the following fields:
- `foodName`: Name of the food (required, string)
- `freshness`: Freshness rating from 1-5 (required, number)
- `emergency`: Time window for food consumption (required, string)
- `location`: Location text description (required, string, min length 3)
- `locationELoc`: MapmyIndia eLoc code (required, string, min length 6)
- `image`: Food image file (optional, image file)

Example (Form Data):
```
foodName: "Fresh Vegetables"
freshness: 5
emergency: "4-6 hours"
location: "123 Main Street, City"
locationELoc: "ABC123"
image: [binary file data]
```

### Response:
```json
{
  "success": true,
  "donation": {
    "foodName": "Fresh Vegetables",
    "freshness": 5,
    "emergency": "4-6 hours",
    "location": "123 Main Street, City",
    "locationELoc": "ABC123",
    "imageUrl": "/uploads/1234567890-image.jpg",
    "createdAt": "2024-01-20T12:00:00.000Z"
  }
}
```

# Maps API Endpoints

## Endpoint: `/maps/get-suggestions`

### Method: GET

### Description:
This endpoint provides location suggestions based on user input using MapmyIndia API.

### Headers:
- `Authorization`: Bearer token (required)

### Query Parameters:
- `input`: Search text for location (required, string)

### Example Response:
```json
{
  "suggestions": [
    {
      "displayText": "Location Name",
      "eLoc": "ABC123",
      "address": "Full address"
    }
    // ... more suggestions
  ]
}
```

## Endpoint: `/maps/get-distance`

### Method: GET

### Description:
This endpoint calculates distance and estimated time between two locations.

### Headers:
- `Authorization`: Bearer token (required)

### Query Parameters:
- `origin`: Starting location eLoc code (required, string)
- `destination`: Ending location eLoc code (required, string)

### Example Response:
```json
{
  "distance": "5.2 km",
  "duration": "15 mins"
}
```