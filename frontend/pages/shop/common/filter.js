import React from 'react';
import { Col } from 'reactstrap';
import Category from './category';
import Brand from './brand'
import Color from './color'
import Size from './size'
import Price from './price';

const FilterPage = ({ sm, sidebarView, closeSidebar }) => {
    return (
        <>
            <Col sm={sm} className="collection-filter" style={sidebarView ? { left: "0px" } : {}}>
                <div className="collection-filter-block">
                    <div className="collection-mobile-back" onClick={() => closeSidebar()}>
                        <span className="filter-back">
                            <i className="fa fa-angle-left" aria-hidden="true"></i> back
                        </span>
                    </div>
                    <Category />
                    <Brand />
                    <Color />
                    <Size />
                    <Price />
                </div>
            </Col>
        </>
    )
}

export default FilterPage;