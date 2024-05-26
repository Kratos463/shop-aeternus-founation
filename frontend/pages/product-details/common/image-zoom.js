import React from 'react';
import { Media } from 'reactstrap';

const ImageZoom = (props) => {
    const { image } = props;

    return (
        <Media src={`https://thebrandtadka.com/images_inventory_products/multiple_images/${image.Img_file}`} alt={image.Product_id} className="img-fluid image_zoom_cls-0" />
    );
}

export default ImageZoom;
