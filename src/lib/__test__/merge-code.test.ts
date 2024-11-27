/**
 * @jest-environment node
 */

import { mergeCode } from '../utils';

test('mergeCode should correctly merge original and AI edited code', () => {
  const originalCode = `
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import Loading from "@/components/ui/loading";
import { listUnifiedData, updateUnifiedData } from "@/lib/frontend-api-helpers/unified";
import { Markdown } from "@/components/ui/markdown";
import AdvancedTable from "@/components/ui/advanced-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const App = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedTicketData, setUpdatedTicketData] = useState({});
  const queryClient = useQueryClient();

  const filterConfigs = [
    {
      id: "priority",
      label: "Priority",
      filterFn: "equals",
      type: "dropdown",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
    {
      id: "status",
      label: "Status",
      filterFn: "equals",
      type: "dropdown",
      options: [
        { value: "open", label: "Open" },
        { value: "pending", label: "Pending" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ],
    },
  ];

  const handleRowClick = (row) => {
    setSelectedTicket(row);
    setIsUpdateModalOpen(true);
    setUpdatedTicketData(row);
  };

  const updateTicketMutation = useMutation({
    mutationFn: (data) =>
      updateUnifiedData(
        {
          model: "tickets",
          connectionKey: "test::zendesk::user-2-kk-ptghof-nd-n-7-y-swwj-lf-9-z-rc-dhm/e-mc-0-lr-dlff-qy",
          id: data.id,
        },
        data
      ),
    onSuccess: () => {
      toast.success("Ticket updated successfully");
      setIsUpdateModalOpen(false);
      queryClient.invalidateQueries(["tickets"]);
    },
    onError: (error) => {
      toast.error(\`Error updating ticket: \${error.message}\`);
    },
  });

  const handleUpdateTicket = () => {
    updateTicketMutation.mutate(updatedTicketData);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          <img src="https://assets.buildable.dev/catalog/node-templates/zendesk.svg" alt="Zendesk Logo" className="w-8 h-8 inline-block mr-2" />
          Zendesk Ticket Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <AdvancedTable
            model="tickets"
            connectionKey="test::zendesk::user-2-kk-ptghof-nd-n-7-y-swwj-lf-9-z-rc-dhm/e-mc-0-lr-dlff-qy"
            onRowClick={handleRowClick}
            filterConfigs={filterConfigs}
            displayFields={["id", "title", "status", "priority", "createdAt"]}
            additionalColumns={[
              {
                header: "Priority",
                cell: (row) => (
                  <Badge variant={getPriorityVariant(row.priority)}>{row.priority}</Badge>
                ),
              },
              {
                header: "Status",
                cell: (row) => (
                  <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                ),
              },
            ]}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Ticket</DialogTitle>
            <DialogDescription>View and update ticket information</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={updatedTicketData.title || ""}
                  onChange={(e) =>
                    setUpdatedTicketData({ ...updatedTicketData, title: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={updatedTicketData.description || ""}
                  onChange={(e) =>
                    setUpdatedTicketData({ ...updatedTicketData, description: e.target.value })
                  }
                  className="w-full min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={updatedTicketData.status || ""}
                    onValueChange={(value) =>
                      setUpdatedTicketData({ ...updatedTicketData, status: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select
                    value={updatedTicketData.priority || ""}
                    onValueChange={(value) =>
                      setUpdatedTicketData({ ...updatedTicketData, priority: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ticket Details</Label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ticket ID:</span> {selectedTicket.id}
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsUpdateModalOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket} disabled={updateTicketMutation.isLoading}>
              {updateTicketMutation.isLoading ? <Loading /> : "Update Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const getPriorityVariant = (priority) => {
  switch (priority) {
    case "low":
      return "secondary";
    case "medium":
      return "default";
    case "high":
      return "warning";
    case "urgent":
      return "destructive";
    default:
      return "default";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "open":
      return "default";
    case "pending":
      return "warning";
    case "resolved":
      return "success";
    case "closed":
      return "secondary";
    default:
      return "default";
  }
};

export default App;
`;

  const aiEditedCode = `
 import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import Loading from "@/components/ui/loading";
import { listUnifiedData, updateUnifiedData } from "@/lib/frontend-api-helpers/unified";
import { Markdown } from "@/components/ui/markdown";
import AdvancedTable from "@/components/ui/advanced-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const App = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedTicketData, setUpdatedTicketData] = useState({});
  const queryClient = useQueryClient();

  // ... existing code ...

  return (
    <Card className="w-full h-full" style={{ backgroundColor: 'blue' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-white">
          <img src="https://assets.buildable.dev/catalog/node-templates/zendesk.svg" alt="Zendesk Logo" className="w-8 h-8 inline-block mr-2" />
          Zendesk Ticket Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <AdvancedTable
            model="tickets"
            connectionKey="test::zendesk::user-2-kk-ptghof-nd-n-7-y-swwj-lf-9-z-rc-dhm/e-mc-0-lr-dlff-qy"
            onRowClick={handleRowClick}
            filterConfigs={filterConfigs}
            displayFields={["id", "title", "status", "priority", "createdAt"]}
            additionalColumns={[
              {
                header: "Priority",
                cell: (row) => (
                  <Badge variant={getPriorityVariant(row.priority)}>{row.priority}</Badge>
                ),
              },
              {
                header: "Status",
                cell: (row) => (
                  <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                ),
              },
            ]}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {/* ... existing Dialog code ... */}
    </Card>
  );
};

// ... existing helper functions ...

export default App;
`;

  const expectedMergedCode = `
function greet(name: string) {
    console.log(\`Hello, \${name}!\`);
    // Added timestamp
    const timestamp = new Date().toLocaleString();
    console.log(\`Logged in at: \${timestamp}\`);
    console.log('Welcome to our platform.');
}
`;

  const mergedCode = mergeCode(originalCode, aiEditedCode);
  console.log('mergedCode', mergedCode);
//   expect(mergedCode).toBe(expectedMergedCode);
});
