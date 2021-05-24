import React from 'react';
import { API } from '../../backend';

const ImageHelper = ({ product }) => {
    const imageurl = product ? `${API}/product/photo/${product._id}` : `https://web.learncodeonline.in/static/g5-e363fe1e4dfa5b64c3e88465b6fcb0b5.jpg`
    return (
        <div>
            <img
                src={`${imageurl}`}
                alt="TShirt"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                className="mb-3 rounded"
            />
        </div>
    )
}

export default ImageHelper;