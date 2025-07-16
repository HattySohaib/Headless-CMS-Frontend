import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import "./Editor.css";
import { useParams } from "react-router-dom";
import ImageBtn from "../../components/ButtonsE/ImageBtn";
import DropArea from "../../components/DropArea/DropArea";
import Loader from "../../components/Loader/Loader";
import { apiService } from "../../services/apiService";

import { useFileContext } from "../../contexts/file.js";

import {
  RiImageAddLine,
  RiSaveLine,
  RiArrowLeftLine,
  RiCloseLine,
  RiCheckLine,
  RiImageLine,
} from "@remixicon/react";

import deskBanner from "../../assets/editor_icons/deskbanner.png";
import publishIcon from "../../assets/editor_icons/publish.png";

import "../../components/ButtonsE/Btn.css";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme.js";

export default function Editor() {
  const { user } = useAuthContext();
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Type something...",
      minHeight: "500px",
      disablePlugins: "ai-assistant",
      buttons:
        "font,fontsize,bold,italic,underline,strikethrough,eraser,|,ul,ol,paragraph,lineHeight,superscript,subscript,|,cut,copy,paste,copyformat,|,table,link,symbols,indent,outdent,left,brush,|,undo,redo,find,|,source,fullsize,preview",
    }),
    []
  );
  const [loading, setLoading] = useState(true);
  const [oldBanner, setOldBanner] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [banner, setBanner] = useState(null);
  const [published, setPublished] = useState(false);
  const [isDragAreaVisible, setIsDragAreaVisible] = useState(false);

  const { selectedFiles } = useFileContext();

  const { blog } = useParams();
  const { theme } = useTheme();

  useEffect(() => {
    fetchBlog();
    fetchCategories();
  }, [blog]);

  const fetchBlog = async () => {
    if (blog) {
      try {
        const blogData = await apiService.get(
          `/blogs/blog-details?blog=${blog}`
        );
        setTitle(blogData.title);
        setMetaDescription(blogData.meta);
        setOldBanner(true);
        setCategory(blogData.category);
        setContent(blogData.content);
        setPublished(false);
        setLoading(false);
      } catch (err) {
        toast.error(err);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.get(
        "/categories/",
        apiService.getAuthHeaders(user.token)
      );
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageAdd = () => {
    const formData = new FormData();
    if (selectedFiles) {
      formData.append("file", selectedFiles[0]);
      apiService
        .post(
          "/blogs/upload-image-for-blog",
          formData,
          apiService.getAuthHeaders(user.token)
        )
        .then((result) => {
          setContent(content + `<img src="${result}" width="300"/>`);
          handleButtonClick();
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.warn("Please select a banner image");
    }
  };

  const handleBannerChange = (event) => {
    setOldBanner(false);
    setBanner(event.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleMetaChange = (e) => {
    setMetaDescription(e.target.value);
  };

  const handleCatChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePublish = () => {
    setPublished(true);
  };

  const handleButtonClick = () => {
    setIsDragAreaVisible(!isDragAreaVisible);
  };

  useEffect(() => {
    if (published) {
      handleAddBlog();
    }
  }, [published]);

  const handleAddBlog = () => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("meta", metaDescription);
    formData.append("content", content);
    formData.append("published", published);
    if (banner) {
      formData.append("banner", banner);
      apiService
        .post(
          "/blogs/save-new-blog",
          formData,
          apiService.getAuthHeaders(user.token)
        )
        .then((result) => {
          toast.success(result);
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.warn("Please select both banner images");
    }
  };

  const handleEditBlog = () => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("meta", metaDescription);
    formData.append("content", content);
    formData.append("published", published);
    if (banner) {
      formData.append("banner", banner);
    }
    apiService
      .post(
        `/blogs/save-edited-blog?blog=${blog}`,
        formData,
        apiService.getAuthHeaders(user.token)
      )
      .then((result) => {
        toast.success(result);
      })
      .catch((error) => {
        toast.error(error);
      });
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
        <Link className="back-btn" to="/playground/dashboard">
          <RiArrowLeftLine size="1.5rem" color="var(--txt)" />
        </Link>
      </div>
      <input
        id="title"
        name="title"
        type="text"
        autoComplete="off"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <label id="meta-label" htmlFor="meta">
        Meta Description
      </label>
      <input
        id="meta"
        name="meta"
        type="text"
        autoComplete="off"
        placeholder="This will be the preview to your blog"
        value={metaDescription}
        onChange={handleMetaChange}
      />
      <div className="editor-top-bar">
        <select name="categories" id="categories" onChange={handleCatChange}>
          <option value="General" defaultValue={true}>
            Select Category
          </option>
          {categories.map((cat, index) => (
            <option key={index} value={`${cat.value}`}>
              {cat.value}
            </option>
          ))}{" "}
        </select>

        <div className="button-row">
          <ImageBtn
            img={deskBanner}
            onChange={handleBannerChange}
            selectedFile={banner}
            oldBanner={oldBanner}
          />
          <button onClick={handleButtonClick} className="insert-img-btn">
            <RiImageAddLine size="1.2rem" color="var(--txt)" />
            <span>Insert Image</span>
          </button>
        </div>

        {isDragAreaVisible && (
          <>
            <div className="backdrop" onClick={handleButtonClick}>
              <button onClick={handleImageAdd} className="upload-img-btn">
                <RiCheckLine size="1.2rem" />
                <p>Upload Image</p>
              </button>
            </div>
            <DropArea onClose={handleButtonClick} />
          </>
        )}
        <div className="editor-action-btns">
          {!blog && (
            <>
              <button
                id="save-btn"
                onClick={handleAddBlog}
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
                <img className="btn-icon" src={publishIcon} alt="publish" />
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

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
}
