import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/ProductPiker.scss";
import ProductModal from "./Modal";
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

const ItemType = "PRODUCT";

const ProductRow = ({ product, index, moveProduct, handleProductClick }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveProduct(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="product-row"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      <i
        id="pointer"
        className="fa-solid fa-grip-vertical fa-xl"
        style={{ color: "#9aaed0" }}
      ></i>
      <div className="product-row-index">{index + 1}.</div>
      <input
        className="product-input"
        placeholder="Select Product"
        value={product.title || ""}
        onClick={() => handleProductClick(product.id)}
      />
    </div>
  );
};

const VariantRow = ({
  variant,
  index,
  moveVariant,
  productId,
  handelremove,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: `${ItemType}-VARIANT-${productId}`,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveVariant(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: `${ItemType}-VARIANT-${productId}`,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="selected-f-item"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      <div className="root">
        <i
          id="pointer"
          className="fa-solid fa-grip-vertical fa-xl"
          style={{ color: "#9aaed0" }}
        ></i>
        <div className="product-show">
          {variant.title} - ${variant.price}
        </div>
        <button id="cancel" onClick={() => handelremove(productId, variant.id)}>
          x
        </button>
      </div>
    </div>
  );
};

const ProductPicker = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductVariants, setSelectedProductVariants] = useState({});
  const [productDiscounts, setProductDiscounts] = useState({});
  const [showVariants, setShowVariants] = useState({});
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  useEffect(() => {
    const initialProduct = productsData
      .filter((item) => item.id === 77)
      .map((product) => ({
        ...product,
        title: `select product ${product.id}`,
      }));

    setProducts(initialProduct);
  }, []);

  const addProductRow = () => {
    setProducts((prevProducts) => {
      const maxId =
        prevProducts.length > 0
          ? Math.max(...prevProducts.map((product) => product.id))
          : 0;

      return [
        ...prevProducts,
        {
          id: maxId + 1,
          title: `select product ${maxId + 1}`,
          variants: [],
          image: {},
        },
      ];
    });

    setProductDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [products.length + 1]: { type: null, amount: 0 },
    }));
  };

  const moveProduct = (dragIndex, hoverIndex) => {
    const updatedProducts = [...products];
    [updatedProducts[dragIndex], updatedProducts[hoverIndex]] = [
      updatedProducts[hoverIndex],
      updatedProducts[dragIndex],
    ];

    setProducts(updatedProducts);
  };

  const moveVariant = (productId, dragIndex, hoverIndex) => {
    setSelectedProductVariants((prevVariants) => {
      const productVariants = [...prevVariants[productId]];

      [productVariants[dragIndex], productVariants[hoverIndex]] = [
        productVariants[hoverIndex],
        productVariants[dragIndex],
      ];

      return {
        ...prevVariants,
        [productId]: productVariants,
      };
    });
  };

  const handleProductSelect = (variants) => {
    if (selectedProductIndex !== null) {
      setSelectedProductVariants((prevState) => ({
        ...prevState,
        [selectedProductIndex]: variants,
      }));
    }

    setIsModalOpen(false);
  };

  const handleProductClick = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const toggleSelectedProducts = (productId) => {
    setShowVariants((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleDiscountChange = (productId, type, amount) => {
    setProductDiscounts((prevDiscounts) => ({
      ...prevDiscounts,
      [productId]: {
        type,
        amount: parseFloat(amount) || 0,
      },
    }));
  };

  const handelremove = (productId, variantId) => {
    setSelectedProductVariants((prevVariants) => ({
      ...prevVariants,
      [productId]: prevVariants[productId].filter(
        (variant) => variant.id !== variantId
      ),
    }));
  };

  const handleRemoveProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );

    setSelectedProductVariants((prevVariants) => {
      const newVariants = { ...prevVariants };
      delete newVariants[productId];
      return newVariants;
    });

    setProductDiscounts((prevDiscounts) => {
      const newDiscounts = { ...prevDiscounts };
      delete newDiscounts[productId];
      return newDiscounts;
    });
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="product-picker">
          <div className="product-data">
            {products.map((product, index) => (
              <React.Fragment key={product.id}>
                <div className="single-product">
                  <ProductRow
                    index={index}
                    product={product}
                    moveProduct={moveProduct}
                    handleProductClick={handleProductClick}
                  />
                  <div className="discount">
                    {productDiscounts[product.id]?.type ? (
                      <div className="discount-container">
                        <input
                          type="number"
                          className="discount-amount"
                          value={productDiscounts[product.id].amount || ""}
                          onChange={(e) =>
                            handleDiscountChange(
                              product.id,
                              productDiscounts[product.id].type,
                              e.target.value
                            )
                          }
                        />
                        <select
                          className="discount-type"
                          value={productDiscounts[product.id].type}
                          onChange={(e) =>
                            handleDiscountChange(
                              product.id,
                              e.target.value,
                              productDiscounts[product.id].amount
                            )
                          }
                        >
                          <option value="flat">Flat</option>
                          <option value="%off">% off</option>
                        </select>
                      </div>
                    ) : (
                      <button
                        className="add-discount-button"
                        onClick={() =>
                          setProductDiscounts((prev) => ({
                            ...prev,
                            [product.id]: { type: "flat", amount: 0 },
                          }))
                        }
                      >
                        Add Discount
                      </button>
                    )}
                    <div>
                      <button
                        id="cancel"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        x
                      </button>
                    </div>
                  </div>
                </div>
                {selectedProductVariants[product.id] && (
                  <div className="varient-root">
                    {selectedProductVariants[product.id].length > 0 && (
                      <div className="varient-button">
                        <button
                          className="show"
                          onClick={() => toggleSelectedProducts(product.id)}
                        >
                          {showVariants[product.id] ? "Hide" : "Show"} Variants{" "}
                          <i
                            id="pointer"
                            className="fa-solid fa-chevron-down"
                          ></i>
                        </button>
                      </div>
                    )}
                    <div className="selected-products">
                      {showVariants[product.id] &&
                        selectedProductVariants[product.id] && (
                          <div>
                            {selectedProductVariants[product.id].map(
                              (variant, index) => (
                                <VariantRow
                                  key={variant.id}
                                  index={index}
                                  variant={variant}
                                  moveVariant={(dragIndex, hoverIndex) =>
                                    moveVariant(
                                      product.id,
                                      dragIndex,
                                      hoverIndex
                                    )
                                  }
                                  productId={product.id}
                                  handelremove={handelremove}
                                />
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <button className="add-product-button" onClick={addProductRow}>
            Add Product
          </button>
          {isModalOpen && (
            <ProductModal
              onClose={() => setIsModalOpen(false)}
              onSelect={handleProductSelect}
            />
          )}
        </div>
      </DndProvider>
    </>
  );
};

export default ProductPicker;
