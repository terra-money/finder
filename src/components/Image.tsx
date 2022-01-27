const Image = ({ url, className }: { url?: string; className?: string }) =>
  url ? <img src={url} alt="img" className={className} /> : null;

export default Image;
