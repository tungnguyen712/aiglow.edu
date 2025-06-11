import PropTypes from "prop-types";
import { useState } from "react";
import ImageNotFound from "@/assets/images/image-not-found.png";

function Image({ src, alt = "", className = "" }) {
    const imgNotFound = ImageNotFound;
    const [hasError, setHasError] = useState(false);

    const handleImageError = (e) => {
        if (!hasError) {
            e.target.src = imgNotFound;
            setHasError(true);
        }
    };

    return <img src={src || imgNotFound} alt={alt} className={className} onError={handleImageError} />;
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
};

export default Image;
