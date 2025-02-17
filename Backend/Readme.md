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
    - `fullname` (object),
        - `firstname` (String): User's firstname (minimun 3 characters),
        - `lastname` (String): User's lastname (minimum 3 characters),
    - `email`(String): User's email address (must be a valid email),
    - `password` (String): User's password (minimum 6 cahracters),
    - `userType` (String): User type (donor or volunteer) 
- `token` (String): jwt Token