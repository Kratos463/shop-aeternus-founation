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
          {
            path: "/shop/left_sidebar?", Category: "Dresses",
            Category_id: "65", type: "link", icon: "alert"
          },
          {
            path: "/portfolio/grid-3", Category: "GAMES & TOYS",
            Category_id: "73", type: "link", icon: "layout-accordion-merged"
          },
          {
            path: "/portfolio/grid-4", Category: "Jeans & Trousers",
            Category_id: "11", type: "link", icon: "layers"
          },
          {
            path: "/portfolio/masonry-grid-2", Category: "Party Accessories",
            Category_id: "83", type: "link", icon: "write"
          },
          {
            path: "/portfolio/masonry-grid-3", Category: "Shirts & T-Shirts",
            Category_id: "12", type: "link", icon: "map-alt"
          },
          {
            path: "/portfolio/masonry-grid-4", Category: "Shoes",
            Category_id: "9", type: "link", icon: "map-alt"
          },
          {
            path: "/portfolio/masonry-full-width", Category: "Slippers & Flip Flops",
            Category_id: "10", type: "link", icon: "map-alt"
          },
          {
            path: "/portfolio/masonry-full-width", Category: "Winter Wear",
            Category_id: "64", type: "link", icon: "map-alt"
          },
        ],
      },

      {
        title: "BackPack & Travel Bag",
        type: "sub",
        children: [
          {
            path: "/layouts/Nursery", Category: "Backpack",
            Category_id: "34", type: "link", icon: "list"
          },
          {
            path: "/layouts/Vegetables", Category: "Trolley Bag",
            Category_id: "37", type: "link", icon: "gallery"
          },
        ],
      },
      {
        title: "Electronics & Home",
        type: "sub",
        children: [
          {
            path: "/portfolio/title", Category: "Home and Electronics",
            Category_id: "56", type: "link", icon: "bar-chart"
          },
          {
            path: "/portfolio/collection-banner", Category: "Home Furnishing",
            Category_id: "77", type: "link", icon: "thought"
          },
          {
            path: "/portfolio/home-slider", Category: "IT and Mobile Accessories",
            Category_id: "57", type: "link", icon: "video-camera"
          },
        ],
      },
      {
        title: "Men",
        type: "sub",
        children: [
          {
            path: "/portfolio/product-box", Category: "Accessories",
            Category_id: "13", type: "link", icon: "bar-chart"
          },
          {
            path: "/portfolio/product-slider", Category: "Blazers",
            Category_id: "47", type: "link", icon: "thought"
          },
          {
            path: "/portfolio/no-slider", Category: "Innerwear",
            Category_id: "52", type: "link", icon: "video-camera"
          },
          {
            path: "/portfolio/multi-slider", Category: "Jeans & Trousers",
            Category_id: "19", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Jeans & Trousers",
            Category_id: "19", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Shoes",
            Category_id: "14", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Shorts & Lower",
            Category_id: "20", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Slippers & Flip Flops",
            Category_id: "15", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Watches",
            Category_id: "17", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Winter Wear",
            Category_id: "21", type: "link", icon: "headphone"
          },
        ],
      },
      {
        title: "Life Style",
        type: "sub",
        children: [
          {
            path: "/portfolio/order-success", Category: "Accessories",
            Category_id: "63", type: "link", icon: "bar-chart"
          },
        ],
      },
      {
        title: "Books & Stationery",
        type: "sub",
        children: [
          {
            path: "/portfolio/order-success", Category: "Books and Literature",
            Category_id: "75", type: "link", icon: "bar-chart"
          },
          {
            path: "/portfolio/order-success-2", Category: "Stationary",
            Category_id: "76", type: "link", icon: "thought"
          },
        ],
      },
      {
        title: "Women",
        type: "sub",
        children: [
          {
            path: "/portfolio/product-box", Category: "Accessories",
            Category_id: "27", type: "link", icon: "bar-chart"
          },
          {
            path: "/portfolio/product-slider", Category: "Blazers",
            Category_id: "61", type: "link", icon: "thought"
          },
          {
            path: "/portfolio/product-slider", Category: "Hand Bag",
            Category_id: "24", type: "link", icon: "thought"
          },
          {
            path: "/portfolio/no-slider", Category: "Innerwear",
            Category_id: "22", type: "link", icon: "video-camera"
          },
          {
            path: "/portfolio/multi-slider", Category: "Jeans & Trousers",
            Category_id: "30", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/multi-slider", Category: "Kurtas & Kurtis",
            Category_id: "28", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Nightwears",
            Category_id: "144", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Saree and Dresses",
            Category_id: "62", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Shirts & T-Shirts",
            Category_id: "29", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Shoes",
            Category_id: "23", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Shorts & Lower",
            Category_id: "31", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Slippers & Flip Flops",
            Category_id: "25", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Watches",
            Category_id: "26", type: "link", icon: "headphone"
          },
          {
            path: "/portfolio/tab", Category: "Winter Wear",
            Category_id: "32", type: "link", icon: "headphone"
          },
        ],
      },
      {
        title: "Health & Personal Care",
        type: "sub",
        children: [
          {
            path: "/portfolio/order-success", Category: "Covid-19",
            Category_id: "48", type: "link", icon: "bar-chart"
          },
          {
            path: "/portfolio/order-success-2", Category: "Health Care Products",
            Category_id: "59", type: "link", icon: "thought"
          },
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
