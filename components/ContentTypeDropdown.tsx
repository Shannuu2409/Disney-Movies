"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentType } from "@/typing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Film, Tv, Zap, ChevronDown } from "lucide-react";

const contentTypes = [
  { type: 'movie' as ContentType, label: 'Movies', icon: Film },
  { type: 'tv' as ContentType, label: 'Web Series', icon: Tv },
  { type: 'anime' as ContentType, label: 'Anime', icon: Zap },
];

export default function ContentTypeDropdown() {
  const [selectedType, setSelectedType] = useState<ContentType>('movie');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    router.push(`/?${params.toString()}`);
  };

  const selectedContent = contentTypes.find(ct => ct.type === selectedType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {selectedContent && <selectedContent.icon className="w-4 h-4" />}
          <span>{selectedContent?.label}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        {contentTypes.map((content, index) => (
          <div key={content.type}>
            <DropdownMenuItem
              onClick={() => handleTypeChange(content.type)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <content.icon className="w-4 h-4" />
              <span>{content.label}</span>
            </DropdownMenuItem>
            {index < contentTypes.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
