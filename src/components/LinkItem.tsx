
import { Link as LinkType } from '@/services/linkService';
import { ExternalLink } from 'lucide-react';

interface LinkItemProps {
  link: LinkType;
  className?: string;
  icon?: React.ReactNode;
}

const LinkItem = ({ link, className = '', icon }: LinkItemProps) => {
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`link-card ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {link.title}
      <ExternalLink size={16} className="ml-1" />
    </a>
  );
};

export default LinkItem;
