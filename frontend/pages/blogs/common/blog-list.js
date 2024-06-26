import React from "react";
import { Col, Media, Row } from "reactstrap";
const BlogList = () => {

  return (
    <>
      {data &&
        data.blog.map((item, i) => (
          <Row className="blog-media" key={i}>
            <Col xl="6">
              <div className="blog-left">
                <a href="#">
                  <Media
                    src={item.img}
                    className="img-fluid blur-up lazyload bg-img"
                    alt=""
                  />
                </a>
              </div>
            </Col>
            <Col xl="6">
              <div className="blog-right">
                <div>
                  <h6>{item.title}</h6>
                  <a href="#">
                    <h4>{item.shortDesc}</h4>
                  </a>
                  <ul className="post-social">
                    <li>Posted By : Admin Admin</li>
                    <li>
                      <i className="fa fa-heart"></i> 5 Hits
                    </li>
                    <li>
                      <i className="fa fa-comments"></i> 10 Comment
                    </li>
                  </ul>
                  <p>{item.longDesc}</p>
                </div>
              </div>
            </Col>
          </Row>
        ))}
    </>
  );
};

export default BlogList;
