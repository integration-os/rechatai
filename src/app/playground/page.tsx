"use client";
import { useState } from "react";
import NavbarComponent from "../../components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ColorfulLoadingAnimation, ColorfulLoadingAnimationComponentProps, colorSchemes } from "../../components/colorful-loading-animation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const animationVariations = [
  { title: "Default", props: {} },
  { title: "Pulsate Animation", props: { animationPattern: "pulsate" } },
  { title: "Spiral Animation", props: { animationPattern: "spiral" } },
  { title: "Wave Animation", props: { animationPattern: "wave" } },
  { title: "Dance Animation", props: { animationPattern: "dance" } },
  { title: "Spine Animation", props: { animationPattern: "spine" } },
  { title: "Default Color Scheme", props: { colorScheme: "default" } },
  { title: "Green-Blue Color Scheme", props: { colorScheme: "greenBlue" } },
  { title: "Pink-Purple Color Scheme", props: { colorScheme: "pinkPurple" } },
  { title: "Blue Shades", props: { colorScheme: "blueShades" } },
  { title: "Warm Colors", props: { colorScheme: "warm" } },
  { title: "All Colors", props: { colorScheme: "all" } },
  { title: "White Shades", props: { colorScheme: "whiteShades" } },
  { title: "Large Scale", props: { scale: 2 } },
  { title: "Small Scale", props: { scale: 0.5 } },
  { title: "Few Shapes", props: { shapeCount: 10 } },
  { title: "Many Shapes", props: { shapeCount: 50 } },
  { title: "Pulsate with Warm Colors", props: { animationPattern: "pulsate", colorScheme: "warm" } },
  { title: "Spiral with Pink-Purple", props: { animationPattern: "spiral", colorScheme: "pinkPurple" } },
  { title: "Wave with Blue Shades", props: { animationPattern: "wave", colorScheme: "blueShades" } },
  { title: "Dance with All Colors", props: { animationPattern: "dance", colorScheme: "all" } },
  { title: "Spine with White Shades", props: { animationPattern: "spine", colorScheme: "whiteShades" } },
  { title: "Large Pulsate", props: { animationPattern: "pulsate", scale: 2 } },
  { title: "Small Spiral", props: { animationPattern: "spiral", scale: 0.5 } },
  { title: "Many Wave Shapes", props: { animationPattern: "wave", shapeCount: 50 } },
  { title: "Few Dance Shapes", props: { animationPattern: "dance", shapeCount: 10 } },
  { title: "Large Green-Blue Spine", props: { animationPattern: "spine", colorScheme: "greenBlue", scale: 2 } },
  { title: "Small All-Color Pulsate", props: { animationPattern: "pulsate", colorScheme: "all", scale: 0.5 } },
  { title: "Many Warm Spiral Shapes", props: { animationPattern: "spiral", colorScheme: "warm", shapeCount: 50 } },
  { title: "Few Blue Shades Wave", props: { animationPattern: "wave", colorScheme: "blueShades", shapeCount: 10 } },
  
];

export default function Playground() {
  const [selectedVariation, setSelectedVariation] = useState(animationVariations[0]);
  const [customProps, setCustomProps] = useState<ColorfulLoadingAnimationComponentProps>({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(animationVariations.length / itemsPerPage);
  const paginatedVariations = animationVariations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handlePropChange = (prop: keyof ColorfulLoadingAnimationComponentProps, value: any) => {
    setCustomProps(prev => ({ ...prev, [prop]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarComponent />
      <div className="container mx-auto py-8 space-y-8">

        <Card>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10">
                {paginatedVariations.map((variation, index) => (
                  <div key={index} className="flex flex-col items-center gap-4">
                    <h3 className="text-xs font-medium mb-2">{variation.title}</h3>
                    <ColorfulLoadingAnimation {...variation.props as ColorfulLoadingAnimationComponentProps} />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ColorfulLoadingAnimation Variations</CardTitle>
            <CardDescription>Explore different configurations of the ColorfulLoadingAnimation component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-8">
              <Select onValueChange={(value) => setSelectedVariation(animationVariations[parseInt(value)])}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a variation" />
                </SelectTrigger>
                <SelectContent>
                  {animationVariations.map((variation, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {variation.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">{selectedVariation.title}</h3>
                <ColorfulLoadingAnimation {...selectedVariation.props as ColorfulLoadingAnimationComponentProps} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom ColorfulLoadingAnimation Controls</CardTitle>
            <CardDescription>Adjust individual props of the ColorfulLoadingAnimation component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scale">Scale</Label>
                <Slider
                  id="scale"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[customProps.scale || 1]}
                  onValueChange={([value]) => handlePropChange('scale', value)}
                />
                <span>{customProps.scale || 1}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shapeCount">Shape Count</Label>
                <Slider
                  id="shapeCount"
                  min={1}
                  max={100}
                  step={1}
                  value={[customProps.shapeCount || 30]}
                  onValueChange={([value]) => handlePropChange('shapeCount', value)}
                />
                <span>{customProps.shapeCount || 30}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <Select onValueChange={(value) => handlePropChange('colorScheme', value as keyof typeof colorSchemes)}>
                  <SelectTrigger id="colorScheme">
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(colorSchemes).map((scheme) => (
                      <SelectItem key={scheme} value={scheme}>
                        {scheme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="animationPattern">Animation Pattern</Label>
                <Select onValueChange={(value) => handlePropChange('animationPattern', value as ColorfulLoadingAnimationComponentProps['animationPattern'])}>
                  <SelectTrigger id="animationPattern">
                    <SelectValue placeholder="Select an animation pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {['default', 'pulsate', 'spiral', 'wave', 'dance', 'spine'].map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>
                        {pattern}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="spine"
                  checked={customProps.spine || false}
                  onCheckedChange={(checked) => handlePropChange('spine', checked)}
                />
                <Label htmlFor="spine">Enable Spine</Label>
              </div>

              <div className="pt-6">
                <ColorfulLoadingAnimation {...customProps} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
