
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
import { AspectRatio } from '@/components/ui/aspect-ratio';

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

// Function to extract video IDs from different platforms
const getVideoEmbedUrl = (url: string) => {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // TikTok - Note: direct embedding is tricky, returning a link to the original
  const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i;
  const tiktokMatch = url.match(tiktokRegex);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  }
  
  // Instagram - Note: direct embedding no longer supported easily
  if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
    // Extract the shortcode
    const instaMatch = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/i);
    if (instaMatch && instaMatch[1]) {
      return `https://www.instagram.com/p/${instaMatch[1]}/embed`;
    }
  }
  
  // Default fallback - just return the original URL
  return url;
};

const LinkItem = ({ link, className = '', icon }: LinkItemProps) => {
  const socialIcon = getSocialIcon(link.icon);
  
  // Use custom styles if available
  const customStyle = {
    backgroundColor: link.backgroundColor || undefined,
    color: link.textColor || undefined,
    borderRadius: link.borderRadius || undefined,
  };
  
  // If it's a video type, render the embedded video
  if (link.displayType === 'video') {
    const embedUrl = getVideoEmbedUrl(link.url);
    return (
      <div className="w-full overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={embedUrl}
            title={link.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </AspectRatio>
        <div className="mt-2 text-center text-sm">
          {link.title}
        </div>
      </div>
    );
  }
  
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
