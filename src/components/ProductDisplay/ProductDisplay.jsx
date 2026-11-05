import React, { useContext } from "react";
import { StoreGive } from "../../context/StoreGive";
import ProductItem from "../ProductItem/ProductItem";
import "./ProductDisplay.css";

const ProductDisplay = ({ category = "All" }) => {
const {
shop_list = [],
categories = [],
productsLoading,
productsError,
fetchProducts,
} = useContext(StoreGive);

const selectedCategory = String(category || "All")
.trim()
.toLowerCase();

const selectedParent = categories.find((item) => {
const name = String(item.name || item.categoryName || "")
.trim()
.toLowerCase();


return !item.parentCategory && name === selectedCategory;


});

const filteredProducts = shop_list.filter((product) => {
if (selectedCategory === "all") {
return true;
}


if (!selectedParent) {
  return false;
}

const productParentId =
  typeof product.parentCategory === "object"
    ? product.parentCategory?._id
    : product.parentCategory;

return String(productParentId) === String(selectedParent._id);


});

if (productsLoading) {
return ( <section className="product-display" id="product-display"> <div className="no-products"> <p>Loading products...</p> </div> </section>
);
}

if (productsError) {
return ( <section className="product-display" id="product-display"> <div className="no-products"> <h3>Unable to load products</h3> <p>{productsError}</p>


      <button type="button" onClick={fetchProducts}>
        Try Again
      </button>
    </div>
  </section>
);


}

return ( <section className="product-display" id="product-display"> <div className="product-display-header"> <h2>
{selectedCategory === "all"
? "Explore Our Products"
: category} </h2>


    <p>Discover your favourite products from Zivnel.</p>
  </div>

  {filteredProducts.length > 0 ? (
    <div className="product-display-list">
      {filteredProducts.map((product) => (
        <ProductItem
          key={product._id}
          id={product._id}
          name={product.name}
          description={product.description}
          price={product.price}
          marketPrice={product.marketPrice}
          image={product.image}
          images={product.images}
          stock={product.stock}
  parentCategory={product.parentCategory}
        />
      ))}
    </div>
  ) : (
    <div className="no-products">
      <h3>No Products Found</h3>
      <p>
        {selectedCategory === "all"
          ? "No products are currently available."
          : `Currently, no products are available in ${category}.`}
      </p>
    </div>
  )}
</section>


);
};

export default ProductDisplay;
