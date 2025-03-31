import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Rows, Columns } from 'lucide-react';
import { updateImageLayout } from '@/services/linkService';

interface ImageLayoutSelectorProps {
  userId: string;
  currentLayout: 'row' | 'column' | 'grid';
  currentColumns: 2 | 3 | 4;
  onLayoutChange: (layout: 'row' | 'column' | 'grid', columns?: 2 | 3 | 4) => void;
}

const ImageLayoutSelector = ({
  userId,
  currentLayout,
  currentColumns,
  onLayoutChange,
}: ImageLayoutSelectorProps) => {
  const [layout, setLayout] = React.useState<'row' | 'column' | 'grid'>(currentLayout);
  const [columns, setColumns] = React.useState<2 | 3 | 4>(currentColumns);

  const handleLayoutChange = (value: string) => {
    setLayout(value as 'row' | 'column' | 'grid');
  };

  const handleColumnsChange = (value: number[]) => {
    setColumns(value[0] as 2 | 3 | 4);
  };

  const handleSave = async () => {
    try {
      await updateImageLayout(userId, layout, layout === 'grid' ? columns : undefined);
      onLayoutChange(layout, layout === 'grid' ? columns : undefined);
    } catch (error) {
      console.error('Error saving layout settings:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Layout</CardTitle>
        <CardDescription>Choose how your images will be displayed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={layout}
          onValueChange={handleLayoutChange}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="row"
              id="row"
              className="peer sr-only"
              aria-label="Row layout"
            />
            <Label
              htmlFor="row"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Rows className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Row</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="column"
              id="column"
              className="peer sr-only"
              aria-label="Column layout"
            />
            <Label
              htmlFor="column"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Columns className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Column</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="grid"
              id="grid"
              className="peer sr-only"
              aria-label="Grid layout"
            />
            <Label
              htmlFor="grid"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <LayoutGrid className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Grid</span>
            </Label>
          </div>
        </RadioGroup>
        
        {layout === 'grid' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="columns" className="text-sm font-medium">
                Grid Columns
              </Label>
              <span className="text-sm font-medium">{columns}</span>
            </div>
            <Slider
              id="columns"
              min={2}
              max={4}
              step={1}
              value={[columns]}
              onValueChange={handleColumnsChange}
              aria-label="Select number of grid columns"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        )}
        
        <Button onClick={handleSave} className="w-full">
          Save Layout
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageLayoutSelector; 