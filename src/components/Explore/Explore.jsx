
import React, { useContext } from "react";
import { StoreGive } from "../../context/StoreGive";
import allImage from "../../assets/images/all-gifts.jpg";
import "./Explore.css";

const Explore = ({ category, setCategory }) => {
  const {
    categories = [],
    categoriesLoading,
    categoriesError,
    fetchCategories,
    getImageUrl,
  } = useContext(StoreGive);

  const allCategories = [
    {
      _id: "all",
      name: "All",
      image: allImage,
      isDefault: true,
    },
...categories
  .filter(
    (item) =>
      item.isActive !== false &&
      !item.parentCategory
  )
      .map((item) => ({
        ...item,
        name: item.name || item.categoryName,
        image: item.image || item.imageUrl || "",
        isDefault: false,
      }))
      .filter((item) => item.name && item.name !== "All"),
  ];

  return (
    <section className="explore" id="explore">
      <h1>Explore Something Special</h1>

      {categoriesLoading ? (
        <p className="explore-status">Loading categories...</p>
      ) : categoriesError ? (
        <div className="explore-status">
          <p>{categoriesError}</p>
          <button type="button" onClick={fetchCategories}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="explore-menu-list">
          {allCategories.map((item) => {
            const isActive = category === item.name;

            const imageUrl = item.isDefault
              ? item.image
              : item.image
              ? typeof getImageUrl === "function"
                ? getImageUrl(item.image)
                : item.image
              : "";

            return (
              <button
                type="button"
                key={item._id}
                className={`explore-menu-list-item ${
                  isActive ? "selected" : ""
                }`}
                onClick={() => setCategory(item.name)}
                aria-pressed={isActive}
              >
                {imageUrl ? (
                  <img
                    className={isActive ? "active" : ""}
                    src={imageUrl}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="explore-category-placeholder">✦</div>
                )}

                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      <hr />
    </section>
  );
};

export default Explore;

