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