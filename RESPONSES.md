# Bloggest API Response Format Documentation

## Overview

The Bloggest API uses standardized response formats across all endpoints to ensure consistent error handling and data structure for frontend applications.

## Base Response Structure

All API responses follow this consistent structure:

```typescript
interface BaseResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string; // ISO 8601 format
  data?: any; // Only present in success responses
  errors?: object; // Only present in error responses
  meta?: object; // Optional metadata (used for pagination, etc.)
}
```

---

## Success Responses

### 1. **Simple Success Response**

```json
{
  "success": true,
  "code": "OK",
  "message": "Operation completed successfully",
  "data": {
    /* response data */
  },
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Usage Examples:**

- User creation: `"User created successfully"`
- Blog deletion: `"Blog deleted successfully"`
- Category update: `"Category updated successfully"`

### 2. **Success with Pagination**

```json
{
  "success": true,
  "code": "OK",
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      /* array of users */
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalUsers": 95,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Used in:**

- `GET /users` - User listing with pagination
- `GET /blogs` - Blog listing with pagination
- `GET /messages` - Message listing with pagination

### 3. **Success with Analytics Data**

```json
{
  "success": true,
  "code": "OK",
  "message": "Blog statistics retrieved successfully",
  "data": {
    "totalBlogs": 50,
    "publishedBlogs": 45,
    "draftBlogs": 5,
    "totalViews": 1250,
    "totalLikes": 320,
    "averageViewsPerBlog": 25,
    "topCategories": [
      /* category stats */
    ],
    "monthlyGrowth": 15.5
  },
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

---

## Error Responses

### 1. **Validation Error (400)**

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {
    "username": "Username is already taken",
    "email": "Email is already registered",
    "profileImage": "Profile image is required"
  },
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Common Field Errors:**

- `username`: "Username is already taken"
- `email`: "Email is already registered"
- `password`: "Password must be at least 8 characters"
- `profileImage`: "Profile image is required"
- `category`: "Cannot delete category. It is being used by 5 blog(s)."

### 2. **Not Found Error (404)**

```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Blog not found",
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Common Not Found Messages:**

- `"User not found"`
- `"Blog not found"`
- `"Category not found"`
- `"Message not found"`
- `"Like not found"`

### 3. **Unauthorized Error (401)**

```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Unauthorized access",
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Common Unauthorized Messages:**

- `"Unauthorized access"`
- `"Old password is incorrect"`
- `"Invalid credentials"`

### 4. **Conflict Error (409)**

```json
{
  "success": false,
  "code": "CONFLICT",
  "message": "A blog with this title already exists",
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

**Common Conflict Messages:**

- `"A blog with this title already exists"`
- `"Category with this name already exists"`
- `"Blog already liked by this user"`
- `"Already following this user"`

### 5. **Server Error (500)**

```json
{
  "success": false,
  "code": "SERVER_ERROR",
  "message": "Failed to create user",
  "errors": {
    "error": "Database connection failed"
  },
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

---

## Response Codes Reference

| HTTP Status | Code               | Usage                                         |
| ----------- | ------------------ | --------------------------------------------- |
| 200         | `OK`               | Successful GET, PUT, PATCH operations         |
| 201         | `OK`               | Successful POST operations (resource created) |
| 400         | `VALIDATION_ERROR` | Request validation failed                     |
| 401         | `UNAUTHORIZED`     | Authentication required or failed             |
| 404         | `NOT_FOUND`        | Resource not found                            |
| 409         | `CONFLICT`         | Resource already exists or conflict           |
| 500         | `SERVER_ERROR`     | Internal server error                         |

---

## Frontend Error Handling Implementation

### TypeScript Interfaces

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data?: T;
  errors?: Record<string, string>;
  meta?: any;
}

interface PaginatedResponse<T> {
  success: true;
  data: {
    [key: string]: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number; // totalUsers, totalBlogs, etc.
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface ValidationErrors {
  [fieldName: string]: string;
}
```

### Error Handler Function

```typescript
const handleApiError = (response: ApiResponse) => {
  switch (response.code) {
    case "VALIDATION_ERROR":
      // Handle form validation errors
      return {
        type: "validation",
        message: response.message,
        fieldErrors: response.errors,
      };

    case "NOT_FOUND":
      // Handle 404 errors
      return {
        type: "not_found",
        message: response.message,
      };

    case "UNAUTHORIZED":
      // Handle auth errors - redirect to login
      return {
        type: "unauthorized",
        message: response.message,
      };

    case "CONFLICT":
      // Handle conflict errors (duplicates, etc.)
      return {
        type: "conflict",
        message: response.message,
      };

    case "SERVER_ERROR":
    default:
      // Handle server errors
      return {
        type: "server_error",
        message: response.message || "An unexpected error occurred",
      };
  }
};
```

### Axios Interceptor Example

```typescript
import axios from "axios";

// Response interceptor for centralized error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiResponse: ApiResponse = error.response?.data;

    if (apiResponse) {
      const handledError = handleApiError(apiResponse);

      // You can trigger global error notifications here
      if (handledError.type === "unauthorized") {
        // Redirect to login
        window.location.href = "/login";
      }

      return Promise.reject(handledError);
    }

    return Promise.reject(error);
  }
);
```

---

## Common Response Patterns by Endpoint

### Authentication

- **Login Success**: `{ success: true, data: { token, userId }, message: "Login successful" }`
- **Login Failed**: `{ success: false, code: "VALIDATION_ERROR", errors: { password: "Invalid password" } }`

### Blog Operations

- **Create Blog**: `{ success: true, data: blogObject, message: "Blog created successfully" }`
- **Duplicate Title**: `{ success: false, code: "CONFLICT", message: "A blog with this title already exists" }`

### User Operations

- **Get Users**: `{ success: true, data: { users: [], pagination: {...} } }`
- **Username Taken**: `{ success: false, code: "VALIDATION_ERROR", errors: { username: "Username is already taken" } }`

### Analytics

- **Blog Stats**: `{ success: true, data: { totalBlogs, publishedBlogs, ... } }`
- **Daily Views**: `{ success: true, data: [{ date, views, likes }] }`

This standardized format ensures consistent error handling across your entire frontend application while providing clear, actionable error messages for users.
