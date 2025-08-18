import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "./Editor.css";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

import {
  RiSaveLine,
  RiArrowLeftLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSendPlaneLine,
} from "@remixicon/react";

import { useTheme } from "../../contexts/theme.js";
import { blogApi } from "../../API/blogApi.js";
import { categoryApi } from "../../API/categoryApi.js";

export default function Editor() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isMetaExpanded, setIsMetaExpanded] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Consolidated form state aligned with Blog schema
  const [form, setForm] = useState({
    category: "",
    title: "",
    slug: "",
    meta: "",
    content: "",
    banner: null,
    published: false,
    tags: [], // Array of tag objects for better UX
  });

  const [tagInput, setTagInput] = useState(""); // Current tag being typed

  const { blog } = useParams();
  const { theme } = useTheme();

  useEffect(() => {
    handleGetBlogById();
    handleGetCategories();
  }, [blog]);

  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const slugify = (str) =>
    (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleGetBlogById = async () => {
    if (blog) {
      setLoading(true);
      const response = await blogApi.getBlog(blog);
      if (response.success) {
        const blogData = response.data;
        setForm((prev) => ({
          ...prev,
          title: blogData.title,
          meta: blogData.meta || "",
          category: blogData.category || "",
          content: blogData.content || "",
          slug: blogData.slug || slugify(blogData.title || ""),
          banner: blogData.banner || null,
          published: blogData.published || false,
          tags: Array.isArray(blogData.tags)
            ? blogData.tags.map((tag) => ({
                id: Date.now() + Math.random(),
                text: tag.trim(),
              }))
            : [],
        }));
        setBannerPreview(blogData.banner || null);
      }
      // Error handling is done by apiService centrally
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    const response = await categoryApi.getCategories();
    if (response.success) {
      setCategories(response.data || []);
    }
    // Error handling is done by apiService centrally
  };
  const handleBannerChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, banner: file }));

    // Create preview URL for the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };

  const handleBannerClick = () => {
    document.getElementById("banner-input").click();
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, title: value, slug: slugify(value) }));
  };

  const handleMetaChange = (e) => {
    const value = e.target.value.slice(0, 160); // enforce max length
    setForm((prev) => ({ ...prev, meta: value }));
  };

  const handleCatChange = (e) => {
    setForm((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSlugChange = (e) => {
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;

    // Limit input to 50 characters
    if (value.length <= 50) {
      setTagInput(value);
    }
  };

  const handleTagKeyDown = (e) => {
    const trimmedValue = tagInput.trim();

    if ((e.key === "Enter" || e.key === ",") && trimmedValue) {
      e.preventDefault();
      addTag(trimmedValue);
    } else if (e.key === "Backspace" && !tagInput && form.tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(form.tags[form.tags.length - 1].id);
    }
  };

  const addTag = (tagText) => {
    // Check if tag already exists (case insensitive)
    const tagExists = form.tags.some(
      (tag) => tag.text.toLowerCase() === tagText.toLowerCase()
    );

    if (!tagExists && tagText.length > 0) {
      const newTag = {
        id: Date.now() + Math.random(),
        text: tagText,
      };

      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
    }

    setTagInput("");
  };

  const removeTag = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handlePublish = () => {
    handleCreateBlog(true);
  };

  // No need for effect-based publish; handled inline now

  const navigate = useNavigate();

  const handleCreateBlog = (publish = false) => {
    const fd = new FormData();
    fd.append("category", form.category || "");
    fd.append("title", form.title || "");
    fd.append("slug", form.slug || slugify(form.title));
    fd.append("meta", form.meta || "");
    fd.append("content", form.content || "");
    fd.append("published", publish ? "true" : "false");
    const tagsArr = form.tags.map((tag) => tag.text).filter(Boolean);
    if (tagsArr.length) {
      tagsArr.forEach((t) => fd.append("tags", t));
    }
    if (form.banner) {
      fd.append("banner", form.banner);
      blogApi.createBlog(fd);
      setTimeout(() => {
        navigate("/playground/dashboard");
      }, 100);
    } else {
      toast.warn("Please select both banner images");
    }
  };

  const handleEditBlog = () => {
    const formData = new FormData();
    formData.append("category", form.category || "");
    formData.append("title", form.title || "");
    formData.append("slug", form.slug || slugify(form.title));
    formData.append("meta", form.meta || "");
    formData.append("content", form.content || "");
    formData.append("published", form.published ? "true" : "false");
    const tagsArr = form.tags.map((tag) => tag.text).filter(Boolean);
    if (tagsArr.length) {
      tagsArr.forEach((t) => formData.append("tags", t));
    }
    if (form.banner) {
      formData.append("banner", form.banner);
    }
    blogApi.updateBlog(blog, formData);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`editorpanel editor-${theme}`}>
      <div className="top-panel">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <RiArrowLeftLine size="1.5rem" color="var(--txt)" />
        </button>
        <div className="editor-action-btns">
          {!blog && (
            <>
              <button
                id="save-btn"
                onClick={() => handleCreateBlog(false)}
                className="save-btn"
              >
                <RiSaveLine size="1.2rem" color="var(--txt)" />
                <span>Save to drafts</span>
              </button>

              <button
                id="publish-btn"
                onClick={handlePublish}
                className="publish-btn"
              >
                <RiSendPlaneLine className="btn-icon" size={16} />
                <span>Publish Now</span>
              </button>
            </>
          )}
          {blog && (
            <button id="save-btn" onClick={handleEditBlog} className="save-btn">
              <RiSaveLine size="1.2rem" color="var(--txt)" />
              <span>Save edits</span>
            </button>
          )}
        </div>
      </div>
      <div className="banner-preview-section">
        <div className="banner-preview-container" onClick={handleBannerClick}>
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="banner-preview-image"
            />
          ) : (
            <div className="banner-placeholder">
              <div className="banner-placeholder-content">
                <span>Click to add banner image</span>
                <small>This is how your banner will appear on the blog</small>
              </div>
            </div>
          )}
          <div className="banner-overlay">
            <span>Click to change banner</span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="banner-input"
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          style={{ display: "none" }}
        />
      </div>
      <input
        id="title"
        name="title"
        type="text"
        autoComplete="off"
        placeholder="Title"
        value={form.title}
        onChange={handleTitleChange}
      />

      <div className="meta-section">
        <button
          className="meta-toggle-btn"
          onClick={() => setIsMetaExpanded(!isMetaExpanded)}
          type="button"
        >
          <span>Add more information</span>
          {isMetaExpanded ? (
            <RiArrowUpSLine size="1.2rem" color="var(--pri)" />
          ) : (
            <RiArrowDownSLine size="1.2rem" color="var(--pri)" />
          )}
        </button>

        <div
          className={`meta-fields ${isMetaExpanded ? "expanded" : "collapsed"}`}
        >
          <div className="input-field">
            <label id="slug-label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              autoComplete="off"
              placeholder="auto-generated-from-title"
              value={form.slug}
              onChange={handleSlugChange}
            />
          </div>
          <div className="input-field">
            <label id="meta-label" htmlFor="meta">
              Meta Description
            </label>
            <input
              id="meta"
              name="meta"
              type="text"
              autoComplete="off"
              placeholder="This will be the preview to your blog"
              value={form.meta}
              onChange={handleMetaChange}
            />
          </div>
          <div className="meta-counter">{form.meta.length}/160</div>
          <div className="editor-top-bar">
            <select
              name="categories"
              id="categories"
              value={form.category}
              onChange={handleCatChange}
            >
              <option value="General" defaultValue={true}>
                Select Category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={`${cat.value}`}>
                  {cat.value}
                </option>
              ))}{" "}
            </select>
            <div className="tags-input-container">
              <input
                id="tags"
                name="tags"
                type="text"
                autoComplete="off"
                placeholder={
                  form.tags.length > 0
                    ? "Add another tag..."
                    : "Add tags (press Enter or comma to add)"
                }
                value={tagInput}
                onChange={handleTagsChange}
                onKeyDown={handleTagKeyDown}
              />
              <div className="tag-character-count">{tagInput.length}/50</div>
            </div>
          </div>

          {/* Tag Display Area */}
          {form.tags.length > 0 && (
            <div className="tags-container">
              {form.tags.map((tag) => (
                <div key={tag.id} className="tag-bubble">
                  <span className="tag-text">{tag.text}</span>
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => removeTag(tag.id)}
                    aria-label={`Remove ${tag.text} tag`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReactQuill
        value={form.content}
        onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
        theme="snow"
        modules={modules}
      />
    </div>
  );
}
