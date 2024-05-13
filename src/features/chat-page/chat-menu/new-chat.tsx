"use client";

import { Button } from "@/features/ui/button";
import { LoadingIndicator } from "@/features/ui/loading";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";
import {
  Book,
  Home,
  MessageCircle,
  PocketKnife,
  Sheet,
  VenetianMask,
} from "lucide-react";
import {
  Menu,
  MenuBar,
  MenuItem,
  MenuItemContainer,
  menuIconProps,
} from "@/ui/menu";

export const NewChat = () => {
  const { pending } = useFormStatus();

  return (
    
    <Button
      aria-disabled={pending}
      size={"default"}
      className="flex gap-2"
      variant={"link"}
    >
      
      {pending ? <LoadingIndicator isLoading={pending} /> : <MessageCircle {...menuIconProps} />}
      
    </Button>
  );
};
