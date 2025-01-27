import Footer from "@/components/Footer/Footer";
import MenuOne from "@/components/Header/Menu/MenuOne";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import Product from "@/components/Product/Product";
import ProductPage from "@/components/productpage/ProductPage";

import ShopBreadCrumb1 from "@/components/Shop/ShopBreadCrumb1";
import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";

function CategoryWiseProductPage() {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-transparent" />
            </div>

            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">Shop</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <a href="index.html">Homepage</a>
                                    <i className="ph ph-caret-right text-sm text-secondary2" />
                                    <div className="text-secondary2 capitalize">Shop</div>
                                </div>
                            </div>
                            <div className="filter-type menu-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                <div className="item tab-item text-button-uppercase cursor-pointer has-line-before line-2px" data-item="t-shirt">
                                    t-shirt
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    {/* Left Column: Filter Bar */}
                    <div className="col-md-4">
                        <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                            <div className="container">
                                <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
                                    <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pr-12">
                                        <div className="filter-type-block pb-8 border-b border-line">
                                            <div className="heading6">Products Type</div>
                                            <div className="list-type filter-type menu-tab mt-4">
                                                <div className="item tab-item flex items-center justify-between cursor-pointer" data-item="t-shirt">
                                                    <div className="type-name text-secondary has-line-before hover:text-black capitalize">t-shirt</div>
                                                    <div className="text-secondary2 number">6</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filter-size pb-8 border-b border-line mt-8">
                                            <div className="heading6">Size</div>
                                            <div className="list-size flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                                <div className="size-item text-button w-[44px] h-[44px] flex items-center justify-center rounded-full border border-line" data-item="XS">
                                                    XS
                                                </div>
                                                <div className="size-item text-button w-[44px] h-[44px] flex items-center justify-center rounded-full border border-line" data-item="S">
                                                    S
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filter-price pb-8 border-b border-line mt-8">
                                            <div className="heading6">Price Range</div>
                                            <div className="tow-bar-block mt-5">
                                                <div className="progress" />
                                            </div>
                                            <div className="range-input">
                                                <input className="range-min" type="range" min={0} max={300} defaultValue={0} />
                                                <input className="range-max" type="range" min={0} max={300} defaultValue={300} />
                                            </div>
                                            <div className="price-block flex items-center justify-between flex-wrap mt-4">
                                                <div className="min flex items-center gap-1">
                                                    <div>Min price:</div>
                                                    <div className="min-price">$0</div>
                                                </div>
                                                <div className="min flex items-center gap-1">
                                                    <div>Max price:</div>
                                                    <div className="max-price">$300</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filter-color pb-8 border-b border-line mt-8">
                                            <div className="heading6">colors</div>
                                            <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                                <div className="color-item px-3 py-[5px] flex items-center justify-center gap-2 rounded-full border border-line" data-item="pink">
                                                    <div className="color bg-[#F4C5BF] w-5 h-5 rounded-full" />
                                                    <div className="caption1 capitalize">pink</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filter-brand pb-8 mt-8">
                                            <div className="heading6">Brands</div>
                                            <div className="list-brand mt-4">
                                                <div className="brand-item flex items-center justify-between" data-item="adidas">
                                                    <div className="left flex items-center cursor-pointer">
                                                        <div className="block-input">
                                                            <input type="checkbox" name="adidas" id="adidas" />
                                                            <i className="ph-fill ph-check-square icon-checkbox text-2xl" />
                                                        </div>
                                                        <label htmlFor="adidas" className="brand-name capitalize pl-2 cursor-pointer">
                                                            adidas
                                                        </label>
                                                    </div>
                                                    <div className="text-secondary2 number">12</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="list-product-block style-grid lg:w-3/4 md:w-2/3 w-full md:pl-3">
                                        <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                                            <div className="left flex has-line items-center flex-wrap gap-5"></div>
                                            <div className="sort-product right flex items-center gap-3">
                                                <label htmlFor="select-filter" className="caption1 capitalize">
                                                    Sort by
                                                </label>
                                                <div className="select-block relative">
                                                    <select id="select-filter" name="select-filter" className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line">
                                                        <option value="Sorting">Sorting</option>
                                                        <option value="soldQuantityHighToLow">Best Selling</option>
                                                        <option value="discountHighToLow">Best Discount</option>
                                                        <option value="priceHighToLow">Price High To Low</option>
                                                        <option value="priceLowToHigh">Price Low To High</option>
                                                    </select>
                                                    <i className="ph ph-caret-down absolute top-1/2 -translate-y-1/2 md:right-4 right-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-light p-3 rounded">Filter Bar</div> */}
                    </div>

                    {/* Right Column: Product Grid */}
                    <div className="col-md-8">
                        <div className="row ">
                            {/* Row 1 */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100">
                                    <div className="position-relative">
                                        <img src="https://via.placeholder.com/300x400" className="card-img-top" alt="Product 1" />
                                        <span className="badge bg-success position-absolute top-0 start-0 m-2">NEW</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <h6 className="card-title">Mesh Shirt</h6>
                                        <p className="mb-1">
                                            <strong>$45.00</strong> <span className="text-muted text-decoration-line-through">$55.00</span>
                                        </p>
                                        <p className="text-success mb-0">-18%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100">
                                    <div className="position-relative">
                                        <img src="https://via.placeholder.com/300x400" className="card-img-top" alt="Product 2" />
                                        <span className="badge bg-success position-absolute top-0 start-0 m-2">NEW</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <h6 className="card-title">Raglan Sleeve T-Shirt</h6>
                                        <p className="mb-1">
                                            <strong>$28.00</strong> <span className="text-muted text-decoration-line-through">$36.00</span>
                                        </p>
                                        <p className="text-success mb-0">-22%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100">
                                    <div className="position-relative">
                                        <img src="https://via.placeholder.com/300x400" className="card-img-top" alt="Product 3" />
                                        <span className="badge bg-danger position-absolute top-0 start-0 m-2">SALE</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <h6 className="card-title">Off-The-Shoulder Blouse</h6>
                                        <p className="mb-1">
                                            <strong>$32.00</strong> <span className="text-muted text-decoration-line-through">$40.00</span>
                                        </p>
                                        <p className="text-success mb-0">-20%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional rows can follow the same pattern */}
                        </div>
                    </div>
                </div>
            </div>

            {/* <ProductPage /> */}

            <Footer />
        </>
    );
}

export default CategoryWiseProductPage;
