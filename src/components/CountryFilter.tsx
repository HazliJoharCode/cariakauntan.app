import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const countries = [
  { code: 'MY', name: 'Malaysia', regions: ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak'] },
  { code: 'SG', name: 'Singapore' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' }
];

interface CountryFilterProps {
  selectedCountry: string | null;
  selectedRegion: string | null;
  onSelectCountry: (country: string | null) => void;
  onSelectRegion: (region: string | null) => void;
}

export default function CountryFilter({
  selectedCountry,
  selectedRegion,
  onSelectCountry,
  onSelectRegion
}: CountryFilterProps) {
  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Location</h3>
          {selectedCountry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelectCountry(null);
                onSelectRegion(null);
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selectedCountry ? 
                countries.find((country) => country.code === selectedCountry)?.name : 
                "Select country"}
              <Check className={cn(
                "ml-2 h-4 w-4",
                selectedCountry ? "opacity-100" : "opacity-0"
              )} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." className="h-9" />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onSelectCountry(null);
                    onSelectRegion(null);
                  }}
                  className="justify-between"
                >
                  All Countries
                  <Check className={cn(
                    "h-4 w-4",
                    !selectedCountry ? "opacity-100" : "opacity-0"
                  )} />
                </CommandItem>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    onSelect={() => {
                      onSelectCountry(country.code);
                      onSelectRegion(null);
                    }}
                    className="justify-between"
                  >
                    {country.name}
                    <Check className={cn(
                      "h-4 w-4",
                      selectedCountry === country.code ? "opacity-100" : "opacity-0"
                    )} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedCountryData?.regions && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Region</h3>
            {selectedRegion && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectRegion(null)}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedRegion || "Select region"}
                <Check className={cn(
                  "ml-2 h-4 w-4",
                  selectedRegion ? "opacity-100" : "opacity-0"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search region..." className="h-9" />
                <CommandEmpty>No region found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onSelectRegion(null)}
                    className="justify-between"
                  >
                    All Regions
                    <Check className={cn(
                      "h-4 w-4",
                      !selectedRegion ? "opacity-100" : "opacity-0"
                    )} />
                  </CommandItem>
                  {selectedCountryData.regions.map((region) => (
                    <CommandItem
                      key={region}
                      onSelect={() => onSelectRegion(region)}
                      className="justify-between"
                    >
                      {region}
                      <Check className={cn(
                        "h-4 w-4",
                        selectedRegion === region ? "opacity-100" : "opacity-0"
                      )} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}