import React, { useState, useEffect } from 'react';
import { linkData } from './linkData';
import { fetchData } from './productData';
import { ProductContext } from './ProductContext';




const ProductProvider = ({ children }) => {
  const [state, setState] = useState({
    sidebarOpen: false,
    cartOpen: false,
    cartItems: 0,
    links: linkData,
    cart: [],
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
    storeProducts: [],
    filteredProducts: [],
    featuredProducts: [],
    singleProduct: {},
    loading: true,
    search: '',
    price: 0,
    company: 'all',
  });

  useEffect(() => {
    // Fetch data on component mount
    fetchData().then((items) => {
      console.log('in context');
      console.log(items);
      setProducts(items);
      sortData();
      addTotals();
    
    });
  }, [state.search, state.company, state.price, state.cartItems, state.addTotals]); // Empty dependency array to mimic componentDidMount

  // Function to set products
  const setProducts = (products) => {
    let storeProducts = products.map((item) => {
      const { id } = item.sys;
      const image = item.fields.image.fields.file.url;
      const product = { id, ...item.fields, image };

      return product;
    });

    let featuredProducts = storeProducts.filter((item) => item.featured === true);
    let maxPrice = Math.max(...storeProducts.map((item) => item.price));

    setState((prevState) => ({
      ...prevState,
      storeProducts,
      filteredProducts: storeProducts,
      featuredProducts,
      cart: getStorageCart(),
      singleProduct: getStorageProduct(),
      loading: false,
      price: maxPrice,
      max: maxPrice,
    }));
  };

  // Function to get cart from local storage
  const getStorageCart = () => {
    let cart;
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    } else {
      cart = [];
    }
    return cart;
  };

  // Function to get product from local storage
  const getStorageProduct = () => {
    return localStorage.getItem('singleProduct') ? JSON.parse(localStorage.getItem('singleProduct')) : {};
  };

  // Function to get totals
  const getTotals = () => {
    let subTotal = 0;
    let cartItems = 0;
    state.cart.forEach((item) => {
      subTotal += item.total;
      cartItems += item.count;
    });

    subTotal = parseFloat(subTotal.toFixed(2));
    let tax = subTotal * 0.2;
    tax = parseFloat(tax.toFixed(2));
    let total = subTotal + tax;
    total = parseFloat(total.toFixed(2));

    return {
      cartItems,
      subTotal,
      tax,
      total,
    };
  };

  // Function to add totals
  const addTotals = () => {
    const totals = getTotals();

    setState((prevState) => ({
      ...prevState,
      cartItems: totals.cartItems,
      cartSubTotal: totals.subTotal,
      cartTax: totals.tax,
      cartTotal: totals.total,
    }));
  };

  // Function to sync storage
  const syncStorage = () => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  };

  // Function to add to cart
  const addToCart = (id) => {
    console.log(`add to cart ${id}`);
    let tempCart = [...state.cart];
    let tempProducts = [...state.storeProducts];
    let tempItem = tempCart.find((item) => item.id === id);

    if (!tempItem) {
      tempItem = tempProducts.find((item) => item.id === id);

      let total = tempItem.price;
      let cartItem = { ...tempItem, count: 1, total };

      tempCart = [...tempCart, cartItem];
    } else {
      tempItem.count++;
      tempItem.total = tempItem.price * tempItem.count;
      tempItem.total = parseFloat(tempItem.total.toFixed(2));
    }

    setState((prevState) => ({ ...prevState, cart: tempCart }), () => {
      addTotals();
      syncStorage();
      openCart();
    });
  };

  // Function to set single product
  const setSingleProduct = (id) => {
    let product = state.storeProducts.find((item) => item.id === id);
    localStorage.setItem('singleProduct', JSON.stringify(product));
    setState((prevState) => ({ ...prevState, singleProduct: { ...product }, loading: false }));
  };

  // Function to handle sidebar
  const handleSidebar = () => {
    setState((prevState) => ({ ...prevState, sidebarOpen: !prevState.sidebarOpen }));
  };

  // Function to handle cart
  const handleCart = () => {
    setState((prevState) => ({ ...prevState, cartOpen: !prevState.cartOpen }));
  };

  // Function to close cart
  const closeCart = () => {
    setState((prevState) => ({ ...prevState, cartOpen: false }));
  };

  // Function to open cart
  const openCart = () => {
    setState((prevState) => ({ ...prevState, cartOpen: true }));
  };

  // Function to increment
  const increment = (id) => {
    let tempCart = [...state.cart];
    const cartItem = tempCart.find((item) => item.id === id);
    cartItem.count++;
    cartItem.total = cartItem.count * cartItem.price;
    cartItem.total = parseFloat(cartItem.total.toFixed(2));

    setState((prevState) => ({ ...prevState, cart: [...tempCart] }), () => {
      addTotals();
      syncStorage();
    });
  };

  // Function to decrement
  const decrement = (id) => {
    let tempCart = [...state.cart];
    const cartItem = tempCart.find((item) => item.id === id);

    cartItem.count = cartItem.count - 1;
    if (cartItem.count === 0) {
      removeItem(id);
    } else {
      cartItem.total = cartItem.count * cartItem.price;
      cartItem.total = parseFloat(cartItem.total.toFixed(2));

      setState((prevState) => ({ ...prevState, cart: [...tempCart] }), () => {
        addTotals();
        syncStorage();
      });
    }
  };

  // Function to remove item
  const removeItem = (id) => {
    let tempCart = [...state.cart];
    tempCart = tempCart.filter((item) => item.id !== id);

    setState((prevState) => ({ ...prevState, cart: [...tempCart] }), () => {
      addTotals();
      syncStorage();
    });
  };

  // Function to clear cart
  const clearCart = () => {
    setState((prevState) => ({ ...prevState, cart: [] }), () => {
      addTotals();
      syncStorage();
    });
  };

  // Function to handle filtering
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Function to sort data
  const sortData = () => {
    const { storeProducts, price, company, shipping, search } = state;
    let tempPrice = parseInt(price);
    let tempProducts = [...storeProducts];

    tempProducts = tempProducts.filter((item) => item.price <= tempPrice);

    if (company !== 'all') {
      tempProducts = tempProducts.filter((item) => item.company === company);
    }

    if (search.length > 0) {
      tempProducts = tempProducts.filter((item) => {
        let tempSearch = search.toLowerCase();
        let tempTitle = item.title.toLowerCase().slice(0, search.length);
        return tempSearch === tempTitle;
      });
    }

    setState((prevState) => ({ ...prevState, filteredProducts: tempProducts }));
  };

  return (
    <ProductContext.Provider
      value={{
        handleSidebar,
        ...state,
        handleCart,
        closeCart,
        openCart,
        addToCart,
        setSingleProduct,
        increment,
        decrement,
        clearCart,
        removeItem,
        handleChange,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};



export { ProductProvider};