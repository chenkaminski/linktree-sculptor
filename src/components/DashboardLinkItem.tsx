
import { useState } from 'react';
import { Link } from '@/services/linkService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import LinkForm from './LinkForm';

interface DashboardLinkItemProps {
  link: Link;
  onEdit: (id: string, data: { title: string; url: string }) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const DashboardLinkItem = ({ 
  link, 
  onEdit, 
  onDelete,
  isDragging = false,
}: DashboardLinkItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (data: { title: string; url: string }) => {
    onEdit(link.id, data);
    setIsEditing(false);
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

  return (
    <Card className={`mb-3 ${isDragging ? 'opacity-50' : ''}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="cursor-move mr-2 text-gray-400">
            <GripVertical size={18} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{link.title}</h3>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>
        </div>
        <div className="flex gap-2">
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
