import React from "react";
import { Container, Row, Col } from "reactstrap";
import { formatCustomTimestamp } from "../../helpers/utils";

const MasterReview = ({ name, datetime, review, likes, dislikes, rate }) => {
  return (
    <li>
      <div className="media">
        <div className="media-body">
          <h6>
            <span>{rate} ★</span> {review}
          </h6>
          <p>{name} <span>({datetime})</span></p>
          <ul className="comnt-sec">
            <li>
              <a href="#">
                <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                <span>({likes})</span>
              </a>
            </li>
            <li>
              <a href="#">
                <div className="unlike">
                  <i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
                  <span>({dislikes})</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

const Review = ({ productReviews }) => {
  return (
    <Container className="blog-detail-page review-page">
      <Row>
        <Col sm="12">
          {productReviews && productReviews.length > 0 ? (
            <ul className="comment-section">
              {productReviews.map((review) => (
                <MasterReview
                  key={review._id}
                  name={review.userId.username}
                  rate={review.rating}
                  datetime={formatCustomTimestamp(review.createdAt)}
                  review={review.reviewText}
                  likes={review.likes}
                  dislikes={review.dislikes}
                />
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Review;
