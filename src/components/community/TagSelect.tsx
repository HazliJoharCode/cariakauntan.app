import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Tag as TagIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  loading?: boolean;
}

export default function TagSelect({ tags, selectedTags, onChange, loading }: TagSelectProps) {
  const [open, setOpen] = useState(false);

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (!tag) return null;

          return (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <span>Select tags</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {tags.map(tag => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    if (selectedTags.includes(tag.id)) {
                      removeTag(tag.id);
                    } else {
                      addTag(tag.id);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}