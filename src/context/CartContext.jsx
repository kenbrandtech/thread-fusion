"use client";
import { createContext, useReducer, useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            const existingItem = state.find((item) => item.id === action.payload.id);
            if (existingItem) {
                // Map through the state and handle the quantity and varientArr update
                const updatedState = state.map((item) => {
                    if (item.id === action.payload.id) {
                        // Check if adding one more would exceed the max quantity
                        if (item.quantity + 1 > action.payload.maxQuantity) {
                            toast.error(`You cannot add more than ${action.payload.maxQuantity} units of this product to your cart.`, {
                                position: "top-center",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light"
                            });
                            return item; // Return unchanged item if quantity exceeds the max
                        } else {
                            return {
                                ...item,
                                varientArr: action.payload.varientArr,
                                quantity: Math.min(item.quantity + 1, action.payload.maxQuantity)
                            };
                        }
                    }
                    return item;
                });

                // Show success message for an already existing item
                toast.success("ITEM ALREADY EXISTS IN YOUR CART!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });

                return updatedState;
            } else {
                // Add new item to the cart
                toast.success("ITEM ADDED TO YOUR CART!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });

                return [...state, { ...action.payload, quantity: 1 }];
            }
        case "REMOVE_FROM_CART":
            return state.filter((item) => item.id !== action.payload.id);
        case "SET_CART":
            return action.payload;
        case "INCREMENT_QUANTITY":
            // return state.map((item) =>
            //     item.id === action.payload.id
            //         ? {
            //               ...item,
            //               quantity: Math.min(item.quantity + 1, action.payload.maxQuantity)
            //           }
            //         : item
            // );
            return state.map((item) =>
                item.id === action.payload.id
                    ? item.quantity + 1 > action.payload.maxQuantity
                        ? (() => {
                              toast.error(`You cannot add more than ${action.payload.maxQuantity} units of this product to your cart.`, {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light"
                              });
                              return item; // Return item without changes if the quantity exceeds the limit
                          })()
                        : {
                              ...item,
                              quantity: Math.min(item.quantity + 1, action.payload.maxQuantity)
                          }
                    : item
            );
        case "DECREMENT_QUANTITY":
            return state
                .map((item) =>
                    item.id === action.payload.id
                        ? {
                              ...item,
                              quantity: Math.max(item.quantity - 1, 0)
                          }
                        : item
                )
                .filter((item) => item.quantity > 0);
        case "CLEAR_CART":
            return [];
        default:
            return state;
    }
};

const initializeCart = () => {
    try {
        if (typeof localStorage !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            return storedCart ? JSON.parse(storedCart) : [];
        } else {
            // console.warn("localStorage is not available.");
            return [];
        }
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, [], initializeCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state));
    }, [state]);

    return <CartContext.Provider value={{ cart: state, dispatch }}>{children}</CartContext.Provider>;
};

export const ContextCartDetails = () => useContext(CartContext);

export const ContextCartDetailsOperations = () => {
    const { cart, dispatch } = ContextCartDetails();
    const [isLoading, setIsLoading] = useState(true);
    const [cartDetails, setCartDetails] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountInPercentage, setDiscountInPercentage] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [address, setAddress] = useState(null);
    const [stateCode, setStateCode] = useState(null);
    const [discountCouponId, setDiscountCouponId] = useState("");
    const [orderPurchaseUnits, setOrderPurchaseUnits] = useState([]);

    const clearCartDetails = () => {
        setCartDetails([]);
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("cart");
    };

    function getNestedVariant(data, varientArr) {
        let currentVariant = data;

        for (let i = 0; i < varientArr.length; i++) {
            const index = varientArr[i];
            if (i === 0) {
                currentVariant = currentVariant[index];
            } else {
                currentVariant = currentVariant["undervarient"][index];
            }
        }

        return currentVariant;
    }

    function mergeProductAndCart(products, cartItems) {
        const cartMap = new Map(cartItems.map((item) => [item.id, item]));
        return products.map((product) => {
            const cartItem = cartMap.get(product._id);
            if (cartItem) {
                let final_main_price = product.sale_price;
                if (product.variant.length !== 0) {
                    final_main_price = getNestedVariant(product.variant, cartItem.varientArr)["price"];
                }
                return {
                    order_details: {
                        total_quantity: cartItem.quantity,
                        varientArr: product.variant.length === 0 ? [] : cartItem.varientArr,
                        varientSuggestionArr: product.variant.length === 0 && product.varientSuggestionArr ? {} : cartItem.varientSuggestionArr
                    },
                    product_details: {
                        name: product.name,
                        slug: product.slug,
                        cover_image: product.cover_image,
                        main_price: product.main_price,
                        sale_price: final_main_price,
                        quantity: product.quantity,
                        imageUrl: product.imageUrl,
                        imageUrl100: product.imageUrl100,
                        imageUrl300: product.imageUrl300,
                        _id: product._id,
                        product_sku: product.product_sku,
                        variant: product.variant
                    },
                    product_id: product._id
                };
            }
            return product;
        });
    }

    useEffect(() => {
        // if (!cart || cart.length === 0) return; // Ensure cart is not empty
        const ids = cart.map((item) => item.id);

        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/cart/", ids, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => {
                if (response.data.status === "success") {
                    const orderPurchaseUnitsArr = [];
                    const cartData = mergeProductAndCart(response.data.data, cart).map((data) => {
                        let data_total = parseFloat((data.order_details["total_quantity"] * data.product_details["sale_price"]).toFixed(2));
                        const { discountedPrice, discountAmount } = calculateDiscount(data_total, discountInPercentage);
                        let data_taxAmount = calculateTax(data_total, taxPercentage);

                        let data_deliveryCharges = parseFloat((deliveryCharges / cart.length).toFixed(2));
                        let data_discountAmount = parseFloat(discountAmount.toFixed(2));
                        let total_price_with_discount_amount = parseFloat((data_total - data_discountAmount).toFixed(2));

                        data.order_details["product_total_price"] = data_total;
                        data.order_details["total_price"] = parseFloat(
                            (parseFloat(total_price_with_discount_amount ?? 0) + 
                             parseFloat(data_taxAmount ?? 0) + 
                             parseFloat(data_deliveryCharges ?? 0)).toFixed(2)
                          );
                        data.order_details["discountInPercentage"] = discountInPercentage;
                        data.order_details["deliveryCharges"] = data_deliveryCharges;
                        data.order_details["discountedPrice"] = parseFloat(discountedPrice.toFixed(2));
                        data.order_details["discountAmount"] = data_discountAmount;
                        data.order_details["taxAmount"] = data_taxAmount;
                        data.order_details["sale_price"] = parseFloat((data.product_details["sale_price"] ?? 0).toFixed(2));

                        let unit = {
                            reference_id: uuid(),
                            amount: {
                                value: parseFloat(
                                    (parseFloat(total_price_with_discount_amount ?? 0) + 
                                     parseFloat(data_taxAmount ?? 0) + 
                                     parseFloat(data_deliveryCharges ?? 0)).toFixed(2)
                                  ),
                                currency_code: "USD"
                            }
                        };

                        orderPurchaseUnitsArr.push(unit);

                        if (data.product_details.variant.length > 0) {
                            const varrintArr = findVariant(data.product_details.variant, data.order_details.varientArr);
                            varrintArr["VarientArrName"].shift();
                            data.order_details["varient_name_arr"] = varrintArr ? varrintArr["VarientArrName"] : [];
                            data.order_details["stock_quantity"] = varrintArr ? varrintArr["quantity"] : 0;
                        } else {
                            data.order_details["stock_quantity"] = data.product_details.quantity;
                        }
                        if(data['order_details']['stock_quantity'] === 0){
                            dispatch({ type: "REMOVE_FROM_CART", payload: { id: data['product_id'] } });
                            Swal.fire({
                                title: data['product_details']['name'] + " is currently out of stock and unavailable.",
                                icon: "error"
                            });
                        }
                        return data;
                    });

                    setCartDetails(cartData);

                    const totalSaleQuantity = cartData.reduce((sum, product) => sum + (product.order_details.total_quantity || 0), 0);
                    const totalSalePrice = cartData.reduce((sum, product) => sum + (product.order_details.total_price || 0), 0);
                    const totalDiscountPrice = cartData.reduce((sum, product) => sum + (product.order_details.discountAmount || 0), 0);
                    const totalTaxPrice = cartData.reduce((sum, product) => sum + (product.order_details.taxAmount || 0), 0);
                    const productTotalPrice = cartData.reduce((sum, product) => sum + (product.order_details.product_total_price || 0), 0);

                    setTotalItem(totalSaleQuantity);
                    setProductPrice(totalSalePrice);
                    setDiscountAmount(totalDiscountPrice);
                    setTaxAmount(totalTaxPrice);
                    setSubtotal(productTotalPrice);
                    setIsLoading(false);
                    setOrderPurchaseUnits(orderPurchaseUnitsArr);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }, [cart, discountInPercentage, deliveryCharges, taxPercentage]);

    useEffect(() => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/get-shipping-and-tax-details/",
                {},
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            )
            .then((response) => {
                // console.log("Response data:", response.data);
                // console.log("Response data:", stateCode);
                if (response.data.status === "success") {
                    const shippingDetailsNew = {
                        national_fix_amount: response.data.national_fix_amount,
                        international_fix_amount: response.data.international_fix_amount,
                        charges_above_national_fix_amount: response.data.charges_above_national_fix_amount,
                        charges_bellow_national_fix_amount: response.data.charges_bellow_national_fix_amount,
                        charges_above_international_fix_amount: response.data.charges_above_international_fix_amount,
                        charges_bellow_international_fix_amount: response.data.charges_bellow_international_fix_amount,
                        national_tax_percentage: response.data.national_tax_percentage,
                        international_tax_percentage: response.data.international_tax_percentage,
                        country_code: response.data.country_code
                    };

                    const isNational = address === shippingDetailsNew.country_code;
                    const fixAmountKey = isNational ? "national_fix_amount" : "international_fix_amount";
                    const chargesAboveKey = isNational ? "charges_above_national_fix_amount" : "charges_above_international_fix_amount";
                    const chargesBelowKey = isNational ? "charges_bellow_national_fix_amount" : "charges_bellow_international_fix_amount";
                    const taxPercentageKey = isNational ? "national_tax_percentage" : "international_tax_percentage";

                    const fixAmount = parseFloat(shippingDetailsNew[fixAmountKey]) || 0;
                    const chargesAbove = parseFloat(shippingDetailsNew[chargesAboveKey]) || 0;
                    const chargesBelow = parseFloat(shippingDetailsNew[chargesBelowKey]) || 0;
                    const taxPercentages = parseFloat(shippingDetailsNew[taxPercentageKey]) || 0;

                    if (totalPrice > fixAmount) {
                        setDeliveryCharges(chargesAbove);
                    } else {
                        setDeliveryCharges(chargesBelow);
                    }
                    // if (address !== null) {
                        if (stateCode === "NM") {
                            setTaxPercentage(taxPercentages);
                        } else {
                            setTaxPercentage(0);
                        }
                    // }
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [address, productPrice, stateCode]);

    function isDateGreaterThanToday(dateStr) {
        const [day, month, year] = dateStr.split("-");
        const givenDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return givenDate > today;
    }

    const applyDicount = (email, phone_number) => {
        if (!discountCouponId) {
            Swal.fire({
                title: "Coupon code is blank",
                icon: "error"
            });
            return false;
        }

        // Determine the URL based on the availability of email and phone_number
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = email || phone_number ? `${baseUrl}/view-discount-coupon-details-by-coupon-code-and-customer-email-phone-number/${discountCouponId}?email=${encodeURIComponent(email || "")}&phone_number=${phone_number || ""}` : `${baseUrl}/view-discount-coupon-details-by-coupon-code-and-customer-id/${discountCouponId}`;

        // Configure headers with Authorization if not using email/phone number
        const headers = {
            accept: "application/json",
            ...(email || phone_number ? {} : { Authorization: `Bearer ${localStorage.getItem("token")}` })
        };

        // Make the Axios GET request
        axios
            .get(url, { headers })
            .then((response) => {
                const { status, data } = response.data;
                if (status === "success" && data.length > 0) {
                    const validity = data[0]?.validity;
                    const discountValue = data[0]?.value_in_percentage;

                    if (isDateGreaterThanToday(validity)) {
                        setDiscountInPercentage(discountValue);
                    } else {
                        Swal.fire({
                            title: "Coupon code is expired",
                            icon: "error"
                        });
                    }
                } else {
                    Swal.fire({
                        title: "Invalid coupon code",
                        icon: "error"
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching coupon details:", error);
            });
    };

    const updateCartDetails = (id, increment, price, varientArr) => {
        setCartDetails((prevCartDetails) =>
            prevCartDetails
                .map((item) => {
                    if (item.product_id === id) {
                        let total_quantity = item.order_details.total_quantity;

                        if (increment) {
                            if (varientArr.length > 0) {
                                const variant = findVariant(item.product_details.variant, varientArr);
                                if (variant && variant.quantity > total_quantity) {
                                    total_quantity++;
                                }
                            } else {
                                if (item.product_details.quantity > total_quantity) {
                                    total_quantity++;
                                }
                            }
                        } else {
                            total_quantity = Math.max(total_quantity - 1, 0);
                        }
                        let individualDeliveryCharges = parseFloat((deliveryCharges / prevCartDetails.length).toFixed(2));
                        const { discountedPrice, discountAmount } = calculateDiscount(total_quantity * price, item.order_details.discountInPercentage);
                        return {
                            ...item,
                            order_details: {
                                ...item.order_details,
                                total_quantity,
                                total_price: parseFloat((discountedPrice * individualDeliveryCharges).toFixed(2)),
                                discountedPrice: parseFloat(discountedPrice.toFixed(2)),
                                individualDeliveryCharges: parseFloat(individualDeliveryCharges.toFixed(2)),
                                discountAmount: parseFloat(discountAmount.toFixed(2)),
                                sale_price: parseFloat(price.toFixed(2))
                            }
                        };
                    }
                    return item;
                })
                .filter((item) => item.order_details.total_quantity > 0)
        );

        setTotalItem((prevTotalItem) => prevTotalItem + (increment ? 1 : -1));
        setProductPrice((prevProductPrice) => prevProductPrice + (increment ? price : -price));
    };

    const productCountIncrement = (id, price, varient, maxQuantity) => {
        updateCartDetails(id, true, price, varient);
        dispatch({ type: "INCREMENT_QUANTITY", payload: { id: id, maxQuantity: maxQuantity } });
    };

    const productCountDecrement = (id, price, varient, maxQuantity) => {
        updateCartDetails(id, false, price, varient);
        dispatch({ type: "DECREMENT_QUANTITY", payload: { id: id, maxQuantity: maxQuantity } });
    };

    const calculateDiscount = (totalPrice, discountPercentage) => {
        if (totalPrice <= 0 || discountPercentage < 0 || discountPercentage > 100) {
            return { discountedPrice: 0, discountAmount: 0 };
        }
        const discountAmount = (totalPrice * discountPercentage) / 100;
        const discountedPrice = totalPrice - discountAmount;
        return { discountedPrice: parseFloat(discountedPrice.toFixed(2)), discountAmount: parseFloat(discountAmount.toFixed(2)) };
    };

    const calculateTax = (totalPrice, taxPercentage) => {
        if (totalPrice <= 0 || taxPercentage < 0 || taxPercentage > 100) {
            return { discountedPrice: 0, discountAmount: 0 };
        }
        return parseFloat(((totalPrice * taxPercentage) / 100).toFixed(2));
    };

    const findVariant = (variants, varientArr) => {
        let currentVariants = variants;
        let finalObj = {};
        let VarientArrName = [];
        for (const varientIndex of varientArr) {
            const currentVariant = currentVariants[varientIndex];
            if (!currentVariant) {
                return null;
            }
            VarientArrName.push(currentVariant["varient"]);
            finalObj = currentVariant;
            currentVariants = currentVariant.undervarient;
        }
        finalObj["VarientArrName"] = VarientArrName;
        return finalObj;
    };

    useEffect(() => {
        setTotalPrice(productPrice);
    }, [productPrice]);

    return {
        isLoading,
        cart,
        cartDetails,
        totalItem,
        productPrice,
        totalPrice,
        discountInPercentage,
        discountAmount,
        deliveryCharges,
        taxPercentage,
        taxAmount,
        subtotal,
        address,
        discountCouponId,
        orderPurchaseUnits,
        setDiscountCouponId,
        setAddress,
        setSubtotal,
        setTaxAmount,
        setTaxPercentage,
        setDiscountInPercentage,
        setDiscountAmount,
        setDeliveryCharges,
        calculateDiscount,
        calculateTax,
        productCountIncrement,
        productCountDecrement,
        clearCartDetails,
        applyDicount,
        setIsLoading,
        setCartDetails,
        setStateCode
    };
};
