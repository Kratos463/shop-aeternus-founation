import CategoryContext from "../../helpers/category/CategoryContext";




export const MENUITEMS = [

  {
    title: "Home",
    type: "link",
    path: '/'
  },
  {
    title: "Products",
    megaMenu: true,
    megaMenuType: "small",
    type: "sub",
    children: [
      {
        title: "kids",
        type: "sub",
        children: [
          { path: "/shop/left_sidebar?", title: "Dresses", type: "link", icon: "alert" },
          { path: "/portfolio/grid-3", title: "Games & Toys", type: "link", icon: "layout-accordion-merged" },
          { path: "/portfolio/grid-4", title: "Jeans & Trousers", type: "link", icon: "layers" },
          { path: "/portfolio/masonry-grid-2", title: "Party Accessories", type: "link", icon: "write" },
          { path: "/portfolio/masonry-grid-3", title: "Shirt & T-Shirt", type: "link", icon: "map-alt" },
          { path: "/portfolio/masonry-grid-4", title: "Shoes", type: "link", icon: "map-alt" },
          { path: "/portfolio/masonry-full-width", title: "Slippers & Flip Flops", type: "link", icon: "map-alt" },
          { path: "/portfolio/masonry-full-width", title: "Winter Wear", type: "link", icon: "map-alt" },
        ],
      },

      {
        title: "BackPack & Travel Bag",
        type: "sub",
        children: [
          { path: "/layouts/Nursery", title: "Backpack", type: "link", icon: "list" },
          { path: "/layouts/Vegetables", title: "Trolley Bag", type: "link", icon: "gallery" },
        ],
      },
      {
        title: "Electronics & Home",
        type: "sub",
        children: [
          { path: "/portfolio/title", title: "Home and Electronics", type: "link", icon: "bar-chart" },
          { path: "/portfolio/collection-banner", title: "Home Furnishing", type: "link", icon: "thought" },
          { path: "/portfolio/home-slider", title: "IT and Mobile Accessories", type: "link", icon: "video-camera" },
        ],
      },
      {
        title: "Men",
        type: "sub",
        children: [
          { path: "/portfolio/product-box", title: "Accessories", type: "link", icon: "bar-chart" },
          { path: "/portfolio/product-slider", title: "Blazers", type: "link", icon: "thought" },
          { path: "/portfolio/no-slider", title: "Innerwear", type: "link", icon: "video-camera" },
          { path: "/portfolio/multi-slider", title: "Jeans & Trousers", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Shirts & T-Shirts", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Shoes", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Shorts & Lower", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Slippers & Flip Flops", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Watches", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Winter Wear", type: "link", icon: "headphone" },
        ],
      },
      {
        title: "Life Style",
        type: "sub",
        children: [
          { path: "/portfolio/order-success", title: "Accessories", type: "link", icon: "bar-chart" },
        ],
      },
      {
        title: "Books & Stationery",
        type: "sub",
        children: [
          { path: "/portfolio/order-success", title: "Books and Literature", type: "link", icon: "bar-chart" },
          { path: "/portfolio/order-success-2", title: "Stationary", type: "link", icon: "thought" },
        ],
      },
      {
        title: "Women",
        type: "sub",
        children: [
          { path: "/portfolio/product-box", title: "Accessories", type: "link", icon: "bar-chart" },
          { path: "/portfolio/product-slider", title: "Blazers", type: "link", icon: "thought" },
          { path: "/portfolio/product-slider", title: "Hand Bag", type: "link", icon: "thought" },
          { path: "/portfolio/no-slider", title: "Innerwear", type: "link", icon: "video-camera" },
          { path: "/portfolio/multi-slider", title: "Jeans & Trousers", type: "link", icon: "headphone" },
          { path: "/portfolio/multi-slider", title: "Kurtas & Kurtis", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Nightwears", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Saree and Dresses", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Shoes", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Shorts & Lower", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Slippers & Flip Flops", type: "link", icon: "headphone" },
          { path: "/portfolio/tab", title: "Winter Wear", type: "link", icon: "headphone" },
        ],
      },
      {
        title: "Health & Personal Care",
        type: "sub",
        children: [
          { path: "/portfolio/order-success", title: "Covid-19", type: "link", icon: "bar-chart" },
          { path: "/portfolio/order-success-2", title: "Health Care Products", type: "link", icon: "thought" },
        ],
      },
    ],
  },
  {
    title: "Blogs",
    type: "link",
    path: "/blogs/blog_right_sidebar",
  },
  {
    title: "Contact",
    type: "link",
    path: "/page/account/contact",
  },
];
