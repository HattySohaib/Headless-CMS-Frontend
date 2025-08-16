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
    const data = await categoryApi.getCategories();
    setCategories(data);
  };

  const handleCreateCategory = async () => {
    if (newCategory === "") return;
    const category = {
      value: newCategory,
    };
    await categoryApi.createCategory(category);
    setNewCategory("");
    handleGetCategories();
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategory) return;

    const updatedCategory = {
      value: editingCategory.value,
    };
    await categoryApi.updateCategory(id, updatedCategory);
    handleGetCategories();
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    await categoryApi.deleteCategory(id);
    handleGetCategories();
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
