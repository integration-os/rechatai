import { AddConnectionButton } from "./add-connection-button";

interface AddConnectionButtonServerProps {
  platform: string;
  platformName: string;
}

export function AddConnectionButtonServer({ platform, platformName }: AddConnectionButtonServerProps) {
  return <AddConnectionButton platform={platform} platformName={platformName} />;
}