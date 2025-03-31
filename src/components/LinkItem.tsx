
import { Link as LinkType } from '@/services/linkService';
import { ExternalLink } from 'lucide-react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube, 
  Mail, 
  Link as LinkIcon,
  Globe,
  Twitch,
  Dribbble,
  Figma,
  Slack,
} from 'lucide-react';

interface LinkItemProps {
  link: LinkType;
  className?: string;
  icon?: React.ReactNode;
}

const getSocialIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  
  switch (iconName.toLowerCase()) {
    case 'facebook':
      return <Facebook size={16} />;
    case 'twitter':
    case 'twitter/x':
      return <Twitter size={16} />;
    case 'instagram':
      return <Instagram size={16} />;
    case 'linkedin':
      return <Linkedin size={16} />;
    case 'github':
      return <Github size={16} />;
    case 'youtube':
      return <Youtube size={16} />;
    case 'email':
      return <Mail size={16} />;
    case 'website':
      return <Globe size={16} />;
    case 'twitch':
      return <Twitch size={16} />;
    case 'dribbble':
      return <Dribbble size={16} />;
    case 'figma':
      return <Figma size={16} />;
    case 'slack':
      return <Slack size={16} />;
    default:
      return <LinkIcon size={16} />;
  }
};

const LinkItem = ({ link, className = '', icon }: LinkItemProps) => {
  const socialIcon = getSocialIcon(link.icon);
  
  // Use custom styles if available
  const customStyle = {
    backgroundColor: link.backgroundColor || undefined,
    color: link.textColor || undefined,
    borderRadius: link.borderRadius || undefined,
  };
  
  if (link.displayType === 'icon' && socialIcon) {
    return (
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-icon-link"
        title={link.title}
        style={customStyle}
      >
        {socialIcon}
      </a>
    );
  }
  
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`link-card ${className}`}
      style={customStyle}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {socialIcon && <span className="mr-2">{socialIcon}</span>}
      {link.title}
      <ExternalLink size={16} className="ml-1" />
    </a>
  );
};

export default LinkItem;
