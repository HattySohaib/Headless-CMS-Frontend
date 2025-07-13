import React, { useState, useEffect } from "react";
import "./Categories.css";
import { apiService } from "../../services/apiService";

import Loader from "../../components/Loader/Loader";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";

const CategoryManager = () => {
  const { user } = useAuthContext();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiService.get(
        "/categories",
        apiService.getAuthHeaders(user.token)
      );
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory === "") return;
    const category = {
      value: newCategory,
    };

    try {
      const result = await apiService.post(
        "/categories",
        category,
        apiService.getAuthHeaders(user.token)
      );
      fetchCategories();
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editingCategory) return;

    const updatedCategory = {
      value: editingCategory.value,
    };

    try {
      const result = await apiService.post(
        `/categories/edit-category?id=${id}`,
        updatedCategory,
        apiService.getAuthHeaders(user.token)
      );
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await apiService.post(
        `/categories/delete-category/?id=${id}`,
        {},
        apiService.getAuthHeaders(user.token)
      );
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`cat-board-${theme} catboard`}>
      <div className="editor-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Categories</p>
        </div>
        <div className="custom-input-section">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            className="custom-category-input"
          />
          <button
            onClick={handleAddCategory}
            className="custom-category-button"
          >
            Add Category
          </button>
        </div>
      </div>
      <div className="categories-container">
        <div className="cat-table-headers">
          <p className="table-header">Category</p>
          <p className="table-header">Number of Blogs</p>
          <p className="table-header">Actions</p>
        </div>
        {!categories.length && <p className="blank-text">No records found.</p>}
        {categories.map((cat) => (
          <li key={cat._id} className="custom-category-item">
            {editingCategory && editingCategory._id === cat._id ? (
              <div className="custom-edit-section">
                <input
                  type="text"
                  value={editingCategory.value}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      value: e.target.value,
                    })
                  }
                  className="custom-edit-input"
                />
                <p>{cat.blogCount}</p>
                <div className="cat-actions">
                  <button
                    onClick={() => handleEditCategory(cat._id)}
                    className="custom-save-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="custom-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="custom-view-section">
                <p>{cat.value}</p>
                <p>{cat.blogCount}</p>
                <div className="cat-actions">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="custom-edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="custom-delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
