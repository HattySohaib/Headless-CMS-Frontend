# API Layer Abstraction

This project now uses a centralized API service for all HTTP requests with environment-based configuration.

## Environment Configuration

### Development (.env.development)

```properties
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Production (.env.production)

```properties
REACT_APP_API_BASE_URL=https://api.Irada.com/api
```

## API Service Usage

Import the API service:

```javascript
import { apiService } from "../../services/apiService";
```

### Basic Usage

**GET Request:**

```javascript
const data = await apiService.get("/blogs");
```

**POST Request:**

```javascript
const data = await apiService.post("/blogs", { title: "New Blog" });
```

**With Authentication:**

```javascript
const data = await apiService.get("/user/profile", apiService.getAuthHeaders());
```

**POST with Authentication:**

```javascript
const data = await apiService.post(
  "/blogs",
  blogData,
  apiService.getAuthHeaders()
);
```

### Error Handling

The API service automatically handles HTTP errors and returns JSON data:

```javascript
try {
  const data = await apiService.get("/blogs");
  console.log(data);
} catch (error) {
  console.error("API Error:", error.message);
}
```

### File Uploads

For FormData uploads:

```javascript
const formData = new FormData();
formData.append("file", file);

const data = await apiService.post(
  "/upload",
  formData,
  apiService.getAuthHeaders()
);
```

## Migration from fetch()

**Before:**

```javascript
const response = await fetch("/api/blogs", {
  method: "GET",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});
const data = await response.json();
```

**After:**

```javascript
const data = await apiService.get("/blogs", apiService.getAuthHeaders());
```

## Benefits

1. **Environment Configuration**: Automatic switching between dev/prod APIs
2. **Centralized Error Handling**: Consistent error responses
3. **Simplified Code**: Less boilerplate for API calls
4. **Authentication Helper**: Easy auth header management
5. **Type Safety**: Better IntelliSense and debugging
