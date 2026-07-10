interface FlagIconProps {
  src?: string;
  alt: string;
  className?: string;
}

const FlagIcon = ({ src, alt, className = 'h-3.5 w-5' }: FlagIconProps) => {
  if (!src) {
    return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} />;
  }

  return <img src={src} alt={alt} className={`shrink-0 object-contain ${className}`} />;
};

export default FlagIcon;
