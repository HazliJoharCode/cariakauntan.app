import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <ScrollArea className="pb-4">
      <div className="flex gap-2">
        <Button
          key="all"
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className="whitespace-nowrap"
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "whitespace-nowrap",
              selectedCategory === category && "bg-primary text-primary-foreground"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}