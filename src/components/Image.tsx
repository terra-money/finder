import { useState } from "react";

interface Props {
  url?: string;
  className?: string;
  size?: number;
}

const Image = ({ url, className, size }: Props) => {
  const [isError, setIsError] = useState(false);
  const src = !isError && url;
  const iconSize = { width: size, height: size };
  return src ? (
    <img
      src={src}
      alt="img"
      className={className}
      onError={() => setIsError(true)}
      {...iconSize}
    />
  ) : null;
};

export default Image;
