"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDomain } from "@/lib/utils";
import { useOpenOnboardingAuthKitUx } from "@/hooks/ux/useOpenOnboardingAuthKitUx";

export default function AppsList() {
  const [apps, setApps] = useState<{ name: string; icon: string }[]>([]);
  const [filteredApps, setFilteredApps] = useState<
    { name: string; icon: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { trigger } = useOpenOnboardingAuthKitUx();

  const handleOnClick = (title: string) => {
    trigger(title);
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch(`${getDomain()}/api/connect-apps`);
        const data = await response.json();

        const fetchedApps = data
          ?.map((app: any) => ({
            name: app.title,
            icon: app.image,
          }))
          .sort((a: { name: string }, b: { name: string }) =>
            a.name.localeCompare(b.name)
          );

        setApps(fetchedApps);
        setFilteredApps(fetchedApps);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    const filtered = apps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApps(filtered);
  }, [searchTerm, apps]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const SkeletonCard = () => (
    <Card className="p-4 flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 animate-pulse" />
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 focus:outline-none transition-colors"
          placeholder="Search for more connections..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We could not load the apps. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4  max-h-[430px] overflow-y-auto">
          {filteredApps.map((app) => (
            <Card
              onClick={() => handleOnClick(app.name)}
              key={app.name}
              className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
            >
              <img src={app.icon} alt={app.name} className="w-12 h-12 mb-2" />
              <p className="text-sm font-medium text-center">{app.name}</p>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            No apps found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}