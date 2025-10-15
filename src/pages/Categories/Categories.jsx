import React, { useState, useEffect } from "react";
import "./Categories.css";
import { useTheme } from "../../contexts/theme";
import { categoryApi } from "../../API/categoryApi";

const CategoryManager = () => {
  const { theme } = useTheme();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleGetCategories = async () => {
    const response = await categoryApi.getCategories();
    if (response.success) {
      setCategories(response.data || []);
    }
    // Error handling is done by apiService centrally
  };

  const handleCreateCategory = async () => {
    if (newCategory === "") return;
    const category = {
      name: newCategory,
    };
    const response = await categoryApi.createCategory(category);
    if (response.success) {
      setNewCategory("");
      handleGetCategories();
    }
    // Error handling is done by apiService centrally
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategory) return;

    const updatedCategory = {
      name: editingCategory.name,
    };
    const response = await categoryApi.updateCategory(id, updatedCategory);
    if (response.success) {
      handleGetCategories();
      setEditingCategory(null);
    }
    // Error handling is done by apiService centrally
  };

  const handleDeleteCategory = async (id) => {
    const response = await categoryApi.deleteCategory(id);
    if (response.success) {
      handleGetCategories();
    }
    // Error handling is done by apiService centrally
  };

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
            onClick={handleCreateCategory}
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
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="custom-edit-input"
                />
                <p>{cat.blogCount}</p>
                <div className="cat-actions">
                  <button
                    onClick={() => handleUpdateCategory(cat._id)}
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
                <p>{cat.name}</p>
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
