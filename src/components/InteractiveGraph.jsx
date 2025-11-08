import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ForceGraph from "force-graph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import { getInteractiveGraph } from "@/api/api";

const InteractiveGraph = ({ graphData }) => {
  const [data, setData] = useState({
    nodes: [],
    links: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const graphRef = useRef();

  // Process graph data from props
  useEffect(() => {
    if (!graphData) {
      setError("No knowledge graph data available. Please analyze a project first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Processing graph data:", graphData);
      
      // Transform API data to force-graph format
      const nodes = (graphData.nodes || []).map(node => ({
        id: node.id,
        name: node.id,
        type: node.type,
        status: node.status,
        connections: node.connections || 0
      }));

      const links = (graphData.edges || []).map(edge => ({
        source: edge.from,
        target: edge.to,
        relationship: edge.label || edge.relationship || 'related to'
      }));

      console.log(`Processed ${nodes.length} nodes and ${links.length} links`);
      setData({ nodes, links });
      setLoading(false);
    } catch (err) {
      console.error("Failed to process graph data:", err);
      setError(err.message || "Failed to process graph data");
      setLoading(false);
    }
  }, [graphData]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filteredNodes = data.nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || node.type === typeFilter;
      const matchesStatus = statusFilter === "all" || node.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = data.links.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, searchTerm, typeFilter, statusFilter]);

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    setIsDetailOpen(true);
  }, []);

  // Initialize force graph
  useEffect(() => {
    if (!graphRef.current || !filteredData.nodes.length) return;

    const graph = ForceGraph()(graphRef.current)
      .graphData(filteredData)
      .nodeLabel(node => `
        <div style="background: hsl(222, 47%, 11%); border: 1px solid hsl(214, 23%, 61%); border-radius: 4px; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <div style="font-weight: bold; color: hsl(210, 40%, 98%); font-size: 14px;">${node.name}</div>
          <div style="color: hsl(215, 20%, 65%); font-size: 12px;">Status: ${node.status}</div>
          <div style="color: hsl(215, 20%, 65%); font-size: 12px;">Connections: ${node.connections || 0}</div>
        </div>
      `)
      .nodeVal(node => Math.max(3, (node.connections || 1) * 2))
      .nodeColor(node => {
        // Use design system colors - HSL values from index.css
        switch (node.type) {
          case 'task': return 'hsl(214, 23%, 61%)'; // primary
          case 'person': return 'hsl(348, 29%, 34%)'; // secondary
          case 'project': return 'hsl(7, 56%, 72%)'; // accent
          default: return 'hsl(214, 15%, 45%)'; // muted-foreground
        }
      })
      .linkLabel(link => link.relationship || 'connected to')
      .linkColor(() => 'hsl(214, 23%, 61%)')
      .linkWidth(2)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(2)
      .linkDirectionalParticleColor(() => 'hsl(214, 23%, 61%)')
      .onNodeClick(handleNodeClick)
      .width(800)
      .height(600)
      .onNodeClick(handleNodeClick)
      .width(800)
      .height(600);
      
    return () => {
      if (graphRef.current) {
        graphRef.current.innerHTML = '';
      }
    };
  }, [filteredData, handleNodeClick]);

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const getStatusColor = (status) => {
    // Use design system colors
    switch (status) {
      case 'active': return 'bg-primary';
      case 'pending': return 'bg-accent';
      case 'completed': return 'bg-secondary';
      case 'busy': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return '📁';
      case 'person': return '👤';
      case 'task': return '📋';
      default: return '🔹';
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Project Knowledge Graph</CardTitle>
          <CardDescription>Loading interactive visualization...</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <div className="flex space-x-4 mb-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-4">Error: {error}</div>
        <p className="text-sm text-muted-foreground">Unable to load knowledge graph</p>
      </div>
    );
  }

  if (!data.nodes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No graph data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-4">
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="person">People</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || typeFilter !== "all" || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Graph */}
          <div className="border rounded-lg overflow-hidden bg-background">
            <div 
              ref={graphRef}
              className="w-full h-96 bg-background"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>Nodes: {filteredData.nodes.length}</span>
            <span>Connections: {filteredData.links.length}</span>
          </div>
        </CardContent>

      {/* Node Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedNode ? getTypeIcon(selectedNode.type) : ''}</span>
              {selectedNode?.name}
            </SheetTitle>
            <SheetDescription>
              Detailed information about this {selectedNode?.type}
            </SheetDescription>
          </SheetHeader>
          
          {selectedNode && (
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`${getStatusColor(selectedNode.status)} text-white`}>
                      {selectedNode.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections:</span>
                    <span>{selectedNode.connections || 0}</span>
                  </div>
                </div>
              </div>

              {selectedNode.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Connected To</h4>
                <div className="space-y-1">
                  {data.links
                    .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                    .map((link, index) => {
                      const connectedNodeId = link.source === selectedNode.id ? link.target : link.source;
                      const connectedNode = data.nodes.find(node => node.id === connectedNodeId);
                      return connectedNode ? (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{connectedNode.name}</span>
                          <span className="text-muted-foreground text-xs">{link.relationship}</span>
                        </div>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InteractiveGraph;
