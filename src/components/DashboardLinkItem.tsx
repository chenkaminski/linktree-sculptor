
import { useState } from 'react';
import { Link } from '@/services/linkService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, GripVertical, Palette } from 'lucide-react';
import LinkForm from './LinkForm';
import LinkStylesEditor from './LinkStylesEditor';

interface DashboardLinkItemProps {
  link: Link;
  onEdit: (id: string, data: { title: string; url: string }) => void;
  onDelete: (id: string) => void;
  onStyleUpdate: (id: string, styles: Partial<Link>) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const DashboardLinkItem = ({ 
  link, 
  onEdit, 
  onDelete,
  onStyleUpdate,
  isDragging = false,
  dragHandleProps
}: DashboardLinkItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isStyleEditing, setIsStyleEditing] = useState(false);

  const handleEdit = (data: { title: string; url: string }) => {
    onEdit(link.id, data);
    setIsEditing(false);
  };

  const handleStyleUpdate = (styles: Partial<Link>) => {
    onStyleUpdate(link.id, styles);
    setIsStyleEditing(false);
  };

  // Display link style preview 
  const linkStyle = {
    backgroundColor: link.backgroundColor || '#f3f4f6',
    color: link.textColor || '#000000',
    borderRadius: link.borderRadius || '0.5rem',
  };

  if (isEditing) {
    return (
      <LinkForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        defaultValues={{ title: link.title, url: link.url }}
        isEdit
      />
    );
  }

  if (isStyleEditing) {
    return (
      <LinkStylesEditor
        link={link}
        onSubmit={handleStyleUpdate}
        onCancel={() => setIsStyleEditing(false)}
      />
    );
  }

  return (
    <Card className={`mb-3 ${isDragging ? 'opacity-50' : ''}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="cursor-move mr-2 text-gray-400" {...dragHandleProps}>
            <GripVertical size={18} />
          </div>
          <div className="flex-1 flex items-center">
            <div 
              className="w-8 h-8 rounded mr-3 flex items-center justify-center"
              style={linkStyle}
            >
              {link.displayType === 'icon' && link.icon ? (
                <span className="text-xs">🔗</span>
              ) : (
                <span className="text-xs">Aa</span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{link.title}</h3>
              <p className="text-sm text-gray-500 truncate">{link.url}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsStyleEditing(true)}
            className="text-purple-600"
          >
            <Palette size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(link.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardLinkItem;
