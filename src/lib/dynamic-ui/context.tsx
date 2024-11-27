import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as NextUI from "@nextui-org/react";
import * as RadixUItIcons from "@radix-ui/react-icons";
import * as Iconify from "@iconify/react";
import * as TanStackTable from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import * as recharts from "recharts";
import GenericTable from "@/components/ui/advanced-table";
import * as DndKitCore from '@dnd-kit/core';
import Loading from "@/components/ui/loading";
import { listUnifiedData, createUnifiedData, updateUnifiedData, deleteUnifiedData } from '@/lib/frontend-api-helpers/unified';
import { Markdown } from "@/components/ui/markdown";
import * as lodash from "lodash";
import AdvancedTable from "@/components/ui/advanced-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider"


const ComponentsContext = {
  React,
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
  toast,
  Loading,
  ResizableHandle, ResizablePanel, ResizablePanelGroup,
  ScrollArea, ScrollBar,
  Skeleton,
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  Alert, AlertDescription, AlertTitle,
  Avatar, AvatarFallback, AvatarImage,
  Textarea,
  Input,
  Button,
  Label,
  Checkbox,
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger,
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Popover, PopoverContent, PopoverTrigger,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator,
  Progress,
  ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip,
  NextUI,
  RadixUItIcons,
  Iconify,
  TanStackTable,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Badge,
  useQuery, useMutation, useInfiniteQuery, useQueryClient,
  recharts,
  GenericTable,
  DndKitCore,
  Tabs, TabsContent, TabsList, TabsTrigger,
  listUnifiedData, createUnifiedData, updateUnifiedData, deleteUnifiedData,
  Markdown,
  lodash,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  AdvancedTable,
  Slider,
};

export default ComponentsContext;
