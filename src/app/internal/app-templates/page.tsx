"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "../../../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import NavbarComponent from "@/components/navbar";
import { toast } from "sonner";

interface PlatformUsed {
  platform: string;
  connectionKey: string;
  models: string[];
}

interface AppTemplate {
  category: string;
  title: string;
  code: string;
  description?: string;
  image: string;
  platformsUsed?: PlatformUsed[];
  prompt: string;
  name: string;
}
export default function AppTemplateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storeAppTemplate = useMutation(api.appTemplates.storeAppTemplate);

  const { organization } = useOrganization();

  const [formData, setFormData] = useState<AppTemplate>({
    category: "",
    title: "",
    code: "",
    description: "",
    image: "",
    platformsUsed: [{ platform: "", connectionKey: "", models: [""] }],
    prompt: "",
    name: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (
    index: number,
    field: keyof PlatformUsed,
    value: string
  ) => {
    setFormData((prev) => {
      const newPlatformsUsed = [...(prev.platformsUsed || [])];
      if (field === "models") {
        newPlatformsUsed[index] = {
          ...newPlatformsUsed[index],
          [field]: value.split(","),
        };
      } else {
        newPlatformsUsed[index] = {
          ...newPlatformsUsed[index],
          [field]: value,
        };
      }
      return { ...prev, platformsUsed: newPlatformsUsed };
    });
  };

  const addPlatform = () => {
    setFormData((prev) => ({
      ...prev,
      platformsUsed: [
        ...(prev.platformsUsed || []),
        { platform: "", connectionKey: "", models: [""] },
      ],
    }));
  };

  const removePlatform = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      platformsUsed: prev.platformsUsed?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (organization?.id !== process.env.NEXT_PUBLIC_INTEGRATIONOS_ORGANIZATION_ID) {
      toast.error("Error creating app template", {
        description: "You do not have permission to create app templates",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    e.preventDefault();
    setIsSubmitting(true);
    try {
      await storeAppTemplate(formData);
      toast("App template created", {
        description: "The app template has been successfully created",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      setFormData({
        category: "",
        title: "",
        code: "",
        description: "",
        image: "",
        platformsUsed: [{ platform: "", connectionKey: "", models: [""] }],
        prompt: "",
        name: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error creating app template", {
        description: "An error occurred while creating the app template",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col w-full">
      <NavbarComponent />
      <Card className="w-full max-w-2xl mx-auto my-10">
        <CardHeader>
          <CardTitle>Create App Template</CardTitle>
          <CardDescription>
            Fill in the details to create a new app template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="code">Code</Label>
              <Textarea
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter code"
                className="h-32"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Platforms Used (Optional)</Label>
              {formData.platformsUsed?.map((platform, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Platform"
                    value={platform.platform}
                    onChange={(e) =>
                      handlePlatformChange(index, "platform", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Connection Key"
                    value={platform.connectionKey}
                    onChange={(e) =>
                      handlePlatformChange(
                        index,
                        "connectionKey",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="Models (comma-separated)"
                    value={platform.models.join(",")}
                    onChange={(e) =>
                      handlePlatformChange(index, "models", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removePlatform(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addPlatform} className="mt-2">
                Add Platform
              </Button>
            </div>
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="Enter prompt"
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
