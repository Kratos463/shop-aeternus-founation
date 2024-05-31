import React, { useContext, useEffect, useState } from 'react';
import CategoryContext from '../../../helpers/category/CategoryContext';
import { Container, Row, Col } from 'reactstrap';
import { useRouter } from "next/router";
import FilterContext from '../../../helpers/filter/FilterContext';

const CategoryMenu = () => {

    const router = useRouter();
    const { setSelectedCategory, setSelectedCategoryId } = useContext(FilterContext)
    const { categories, subcategoriesMap } = useContext(CategoryContext);
    const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
    const [hoveredSubcategoryId, setHoveredSubcategoryId] = useState(null);
    const [showCategoryMenu, setShowCategoryMenu] = useState(true);



    useEffect(() => {
        const handleResize = () => {
            setShowCategoryMenu(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCategoryHover = (categoryId) => {
        setHoveredCategoryId(categoryId);
        setHoveredSubcategoryId(null);
    };

    const handleSubcategoryHover = (subcategoryId) => {
        setHoveredSubcategoryId(subcategoryId);
    };

    const handleSubcategoryLeave = () => {
        setHoveredSubcategoryId(null);
    }; 

    const handleCategoryLeave = () => {
        setHoveredCategoryId(null);
    };

    const clickCategory = (subcategory) => {
        router.push(`/shop/left_sidebar?`);
        setSelectedCategory(subcategory.Category);
        setSelectedCategoryId(subcategory.Category_id)
    };

    return (
        <>
            {showCategoryMenu && (
                <div className="category-menu-container">
                    <Container>
                        <Row>
                            {categories?.map((category) => (
                                <Col className='category-section-main' key={category.Category_id}
                                    onMouseEnter={() => handleCategoryHover(category.Category_id)}
                                    onMouseLeave={handleCategoryLeave} >

                                    <div
                                        className="category-link"
                                    >
                                        <div className="category-menu-title" >
                                            <h5 className='category-h'>{category.Category}</h5>
                                        </div>
                                        {hoveredCategoryId === category.Category_id && (
                                            <div className="category-menu-content">
                                                {/*----------- left section of sub category listing -------------------*/}

                                                <div className="left-section">
                                                    {/* category image */}
                                                    <img className="subcategory_image" src={
                                                        "https://thebrandtadka.com//app_cate_images/" +
                                                        category.Default_app_images} alt={category.Category}>
                                                    </img>
                                                </div>

                                                {/*---------- right section of sub category listing--------------- */}



                                                <div className="right-section" style={{ display: 'flex' }}>
                                                    <ul className='subcategory-listing' style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                        <h2 className='categorylisting-h2' style={{ fontSize: '1.5em' }}>{category.Category}</h2>

                                                        {subcategoriesMap[category.Category_id] && subcategoriesMap[category.Category_id].length > 0 ? (
                                                            <>
                                                                {/* First list with the first four subcategories */}
                                                                {subcategoriesMap[category.Category_id]
                                                                    .slice(0, 4)
                                                                    .map((subcategory) => (
                                                                        <li
                                                                            key={subcategory.Category_id}
                                                                            onMouseEnter={() => handleSubcategoryHover(subcategory.Category_id)}
                                                                            onMouseLeave={handleSubcategoryLeave}
                                                                            style={{ cursor: 'pointer' }}
                                                                        >
                                                                            <a
                                                                                className="sub-link"
                                                                                onClick={() => clickCategory(subcategory)}
                                                                                style={{ textDecoration: 'none', color: '#000' }}
                                                                            >
                                                                                {subcategory.Category}
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                            </>
                                                        ) : (
                                                            null
                                                        )}
                                                    </ul>

                                                    {subcategoriesMap[category.Category_id] && subcategoriesMap[category.Category_id].length > 4 && (
                                                        <ul className='subcategory-listing' style={{ listStyleType: 'none', padding: 0, margin: '0 0 0 20px' }}>
                                                            {subcategoriesMap[category.Category_id]
                                                                .slice(4,9)
                                                                .map((subcategory) => (
                                                                    <li
                                                                        key={subcategory.Category_id}
                                                                        onMouseEnter={() => handleSubcategoryHover(subcategory.Category_id)}
                                                                        onMouseLeave={handleSubcategoryLeave}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <a
                                                                            className="sub-link"
                                                                            onClick={() => clickCategory(subcategory)}
                                                                            style={{ textDecoration: 'none', color: '#000' }} 
                                                                        >
                                                                            {subcategory.Category}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    )}
                                                    {subcategoriesMap[category.Category_id] && subcategoriesMap[category.Category_id].length > 8 && (
                                                        <ul className='subcategory-listing' style={{ listStyleType: 'none', padding: 0, margin: '0 0 0 20px' }}>
                                                            {subcategoriesMap[category.Category_id]
                                                                .slice(9)
                                                                .map((subcategory) => (
                                                                    <li
                                                                        key={subcategory.Category_id}
                                                                        onMouseEnter={() => handleSubcategoryHover(subcategory.Category_id)}
                                                                        onMouseLeave={handleSubcategoryLeave}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <a
                                                                            className="sub-link"
                                                                            onClick={() => clickCategory(subcategory)}
                                                                            style={{ textDecoration: 'none', color: '#000' }} 
                                                                        >
                                                                            {subcategory.Category}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    )}
                                                </div>


                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>

                    < style jsx>{`
    .category-menu-container {
        position: relative;
        background-color: #ff4c3b;
        margin: 20px 0;
        display: flex;          
        padding: 5px 0;
        cursor: pointer;
    }
    .category-section-main{
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
    }
   
.subcategory_image{
   max-width:100px;
   height:100px;
   border-radius:5px;



} 

    .category-link-section{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        
       
       
    }
    .rightsubsection{
        flex: 3; 
        display: flex;
        justify-content: flex-start;
        
    }

    .subcategory-listing{
        width:80%;
    }
    .category-menu-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
         
        position :relative;
        white-space: nowrap;


    }
    
    .category-menu-title h5 {
        color: white;
        font-size: 14px;
        margin :0;
        padding:3px;
    }

    .category-menu-title::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 1px;
        background-color: white;
        right: 0;
        top: 0;
        left: calc(100% + 10px);
    }

    .category-menu-content {
        
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        padding: 20px;
        z-index: 10;
        width:100%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px;
    }

    .left-section {
        flex: 1; 
        display: flex;
        justify-content: center;
        align-items: center;
        height:300px;
       
      }


      .right-section {
        flex: 3; 
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height:300px;
      }
    
      .subcategory-listing {
        list-style: none; 
        padding: 0;
      }

      .categorylisting-h2{
        font-size:20px;
      }


      .subcategory-listing li {
        padding: 5px 0; 
        display:flex;
      }
      .sub-link {
        text-decoration: none;
        color: #333;
      }


    .category-menu-content ul li {
        padding: 10px 0;
    }

    .sub-link {
        color: black;
        text-decoration: none;
    }
    

    /* Apply styles from SideBar component */
    .sidenav {
        height: 100%;
        width: 0;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        background-color: #ffffff;
        overflow-x: hidden;
        transition: 0.5s;
        padding-top: 60px;
    }

    .sidenav.open-side {
        width: 250px;
    }

    .sidebar-overlay {
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .sidebar-menu {
        list-style: none;
        padding-left: 0;
    }

    .sidebar-menu li a {
        display: block;
        padding: 10px 20px;
        color: #333;
        text-decoration: none;
    }

    .sidebar-menu li a:hover {
        background-color: #f4f4f4;
    }

    .mega-menu {
        position: absolute;
        left: 250px;
        top: 0;
        width: 250px;
        background-color: #ffffff;
        display: none;
    }

    .mega-menu h5 {
        color: #333;
        padding: 10px 20px;
        margin: 0;
        border-bottom: 1px solid #ddd;
    }

    .mega-menu .link-section {
        padding: 10px 20px;
    }

    .mega-menu .link-section ul {
        list-style: none;
        padding-left: 0;
    }

    .mega-menu .link-section ul li a {
        color: #333;
        text-decoration: none;
    }

    .mega-menu .link-section ul li a:hover {
        color: #ff4c3b;
    }

    .opensidesubmenu {
        display: block !important;
    }
`}</style>

                </div >
            )}
        </>
    );
};

export default CategoryMenu;
