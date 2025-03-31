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
  console.log("url",url)
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

const LinkItem = ({ link, className = '' }: LinkItemProps) => {
  const icon = getSocialIcon(link.icon);

  if (link.display_type === 'video') {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={link.url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
      </div>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full py-3 px-5 rounded-lg flex items-center justify-center gap-2 font-medium transition-transform hover:scale-[1.02] ${className}`}
      style={{
        backgroundColor: link.backgroundColor || '#f3f4f6',
        color: link.textColor || '#000000',
        borderRadius: link.borderRadius || '0.5rem',
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-grow">{link.title}</span>
      <ExternalLink size={16} className="flex-shrink-0" />
    </a>
  );
};

export default LinkItem;
