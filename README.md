# Authorisation in express

The following are instructions on user authentication and authorisation in express. General steps such as setting up MongoDB, models, views, controllers, and routes will not be included in this guide.

## 1. Restricted accesss

Having users authenticate themselves is only important if we are intending on restricting the access of un-authenticated users. Therefore the first thing we will do for this app is set up two pages, one called 'public' which will be accessible to everyone, and one called 'private' which will only be accessible to authenticated users.

For public, nothing special is required.

For private, we restrict access by placing middleware (passport) in our router. Passport  authenticates using a JSON web token (JWT) and sends back a message saying unauthorised if the JWT is incorrect.

## 2. User creation

### 2.1 The form for user creation

### 2.2 Entering the user into the database

## 3. User login

### 3.1 Render login page

### 3.2 Check login information