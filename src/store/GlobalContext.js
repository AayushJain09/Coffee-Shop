// context/GlobalContext.js

import React, {createContext, useContext, useState} from 'react';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

// Create the context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({children}) => {
  // State management
  const [CoffeeList, setCoffeeList] = useState(CoffeeData);
  const [BeanList, setBeanList] = useState(BeansData);
  const [CartPrice, setCartPrice] = useState(0);
  const [FavoritesList, setFavoritesList] = useState([]);
  const [CartList, setCartList] = useState([]);
  const [OrderHistoryList, setOrderHistoryList] = useState([]);

  // Methods to update state
  const addToCart = cartItem => {
    setCartList(prevCartList => {
      let found = false;
      const newList = prevCartList.map(item => {
        if (item.id === cartItem.id) {
          found = true;
          const newPrices = item.prices.map(price => {
            if (price.size === cartItem.prices[0].size) {
              return {...price, quantity: price.quantity + 1};
            }
            return price;
          });
          if (
            !newPrices.some(price => price.size === cartItem.prices[0].size)
          ) {
            newPrices.push(cartItem.prices[0]);
          }
          newPrices.sort((a, b) => (a.size > b.size ? -1 : 1));
          return {...item, prices: newPrices};
        }
        return item;
      });
      if (!found) {
        newList.push(cartItem);
      }
      return newList;
    });
  };

  const calculateCartPrice = () => {
    setCartPrice(prevCartList => {
      let totalprice = 0;
      prevCartList.forEach(item => {
        let tempprice = 0;
        item.prices.forEach(price => {
          tempprice += parseFloat(price.price) * price.quantity;
        });
        item.ItemPrice = tempprice.toFixed(2).toString();
        totalprice += tempprice;
      });
      return totalprice.toFixed(2).toString();
    });
  };

  const addToFavoriteList = (type, id) => {
    if (type === 'Coffee') {
      setCoffeeList(prevList => {
        return prevList.map(item => {
          if (item.id === id) {
            if (!item.favourite) {
              setFavoritesList(prevFavorites => [item, ...prevFavorites]);
            }
            return {...item, favourite: !item.favourite};
          }
          return item;
        });
      });
    } else if (type === 'Bean') {
      setBeanList(prevList => {
        return prevList.map(item => {
          if (item.id === id) {
            if (!item.favourite) {
              setFavoritesList(prevFavorites => [item, ...prevFavorites]);
            }
            return {...item, favourite: !item.favourite};
          }
          return item;
        });
      });
    }
  };

  const deleteFromFavoriteList = (type, id) => {
    if (type === 'Coffee') {
      setCoffeeList(prevList => {
        return prevList.map(item => {
          if (item.id === id) {
            return {...item, favourite: !item.favourite};
          }
          return item;
        });
      });
    } else if (type === 'Bean') {
      setBeanList(prevList => {
        return prevList.map(item => {
          if (item.id === id) {
            return {...item, favourite: !item.favourite};
          }
          return item;
        });
      });
    }
    setFavoritesList(prevFavorites =>
      prevFavorites.filter(item => item.id !== id),
    );
  };

  const incrementCartItemQuantity = (id, size) => {
    setCartList(prevList => {
      return prevList.map(item => {
        if (item.id === id) {
          const newPrices = item.prices.map(price => {
            if (price.size === size) {
              return {...price, quantity: price.quantity + 1};
            }
            return price;
          });
          return {...item, prices: newPrices};
        }
        return item;
      });
    });
  };

  const decrementCartItemQuantity = (id, size) => {
    setCartList(prevList => {
      return prevList
        .map(item => {
          if (item.id === id) {
            const newPrices = item.prices
              .map(price => {
                if (price.size === size) {
                  if (price.quantity > 1) {
                    return {...price, quantity: price.quantity - 1};
                  } else {
                    return null;
                  }
                }
                return price;
              })
              .filter(Boolean);
            return {...item, prices: newPrices.length > 0 ? newPrices : null};
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const addToOrderHistoryListFromCart = () => {
    setOrderHistoryList(prevList => {
      const temp = CartList.reduce(
        (acc, item) => acc + parseFloat(item.ItemPrice),
        0,
      );
      const newOrder = {
        OrderDate: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`,
        CartList,
        CartListPrice: temp.toFixed(2).toString(),
      };
      return [newOrder, ...prevList];
    });
    setCartList([]);
  };

  return (
    <GlobalContext.Provider
      value={{
        CoffeeList,
        BeanList,
        CartPrice,
        FavoritesList,
        CartList,
        OrderHistoryList,
        addToCart,
        calculateCartPrice,
        addToFavoriteList,
        deleteFromFavoriteList,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        addToOrderHistoryListFromCart,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
