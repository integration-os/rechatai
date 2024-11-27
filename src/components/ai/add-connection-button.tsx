"use client";

import { Button } from "@/components/ui/button";
import { useOpenAuthKitUx } from "@/hooks/ux/useOpenAuthKitUx";

interface AddConnectionButtonProps {
  platform: string;
  platformName: string;
}

export function AddConnectionButton({ platform, platformName }: AddConnectionButtonProps) {
  const { trigger } = useOpenAuthKitUx();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => trigger()}
      className="text-xs py-1 px-2 h-auto"
    >
      Connect {platformName}
    </Button>
  );
}