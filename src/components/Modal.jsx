import React, { useState } from "react";
import "../styles/ProductModal.scss";

// Sample product data
const productsData = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      { id: 1, product_id: 77, title: "XS / Silver", price: "49" },
      { id: 2, product_id: 77, title: "S / Silver", price: "49" },
      { id: 3, product_id: 77, title: "M / Silver", price: "49" },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
    },
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      { id: 64, product_id: 80, title: "Default Title", price: "109" },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
    },
  },
];

const ProductModal = ({ onClose, onSelect }) => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const handleProductClick = (product) => {
    const allVariantsSelected = product.variants.every((variant) =>
      selectedVariants.some((item) => item.id === variant.id)
    );

    if (allVariantsSelected) {
      // Deselect all variants of the product
      setSelectedVariants(
        selectedVariants.filter(
          (item) => !product.variants.some((variant) => variant.id === item.id)
        )
      );
    } else {
      // Select all variants of the product
      const newSelected = product.variants.filter(
        (variant) => !selectedVariants.find((item) => item.id === variant.id)
      );
      setSelectedVariants([...selectedVariants, ...newSelected]);
    }
  };

  const handleVariantClick = (variant) => {
    const isSelected = selectedVariants.find((item) => item.id === variant.id);

    if (isSelected) {
      // Deselect the clicked variant
      setSelectedVariants(
        selectedVariants.filter((item) => item.id !== variant.id)
      );
    } else {
      // Select the clicked variant
      setSelectedVariants([...selectedVariants, variant]);
    }
  };

  const isProductSelected = (product) =>
    product.variants.some((variant) =>
      selectedVariants.some((item) => item.id === variant.id)
    );

  // Filter products based on the search query
  const filteredProducts = productsData.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Select Products</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
        <div className="product-list">
          {filteredProducts.map((product) => {
            const anyVariantSelected = isProductSelected(product);

            return (
              <div key={product.id}>
                <div
                  className={`product-title ${
                    anyVariantSelected ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={anyVariantSelected}
                    onChange={() => handleProductClick(product)}
                  />
                  <img src={product.image.src} alt={product.title} />
                  {product.title}
                </div>
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`product-variant ${
                      selectedVariants.find((item) => item.id === variant.id)
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        !!selectedVariants.find(
                          (item) => item.id === variant.id
                        )
                      }
                      onChange={() => handleVariantClick(variant)}
                    />
                    {variant.title} - ${variant.price}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="add-button"
            onClick={() => {
              onSelect(selectedVariants);
              onClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
