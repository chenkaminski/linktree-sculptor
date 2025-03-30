
import { Link as LinkType } from '@/services/linkService';
import { ExternalLink } from 'lucide-react';

interface LinkItemProps {
  link: LinkType;
  className?: string;
}

const LinkItem = ({ link, className = '' }: LinkItemProps) => {
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`link-card ${className}`}
    >
      {link.title}
      <ExternalLink size={16} className="ml-1" />
    </a>
  );
};

export default LinkItem;
