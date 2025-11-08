import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  Calendar,
  FileText,
  Network,
  Download,
  RefreshCw,
} from "lucide-react";
import InteractiveGraph from "@/components/InteractiveGraph";
import { getGraphData, getProjectAnalysis } from "@/api/api";

const Dashboard = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    // Get data from navigation state (passed from Upload page)
    if (location.state?.analysisData) {
      console.log('Dashboard received data from navigation:', location.state.analysisData);
      setAnalysisData(location.state.analysisData);
      setProjectId(location.state.projectId);
    }
  }, [location]);
  
  // Extract data from API response structure
  const projectName = analysisData?.project_name || "Project Analysis";
  const successProbability = Math.round((analysisData?.success_probability || 0.78) * 100);
  const successDescription = analysisData?.success_rate_description || "Based on analyzed communications";
  const keyMetrics = analysisData?.key_metrics || {
    stakeholders: 0,
    documents: 0,
    days_left: 0,
    risks: 0,
    total_entities: 0,
    total_connections: 0
  };

  // Map AI insights from API response with icon assignment
  const insights = analysisData?.ai_insights?.map(insight => {
    let icon;
    switch (insight.type) {
      case "risk":
        icon = AlertTriangle;
        break;
      case "opportunity":
        icon = TrendingUp;
        break;
      default:
        icon = CheckCircle;
    }
    
    return {
      type: insight.type,
      icon: icon,
      title: insight.title,
      description: insight.description,
      severity: insight.type === "risk" ? "high" : insight.type === "opportunity" ? "medium" : "low",
      confidence: insight.confidence
    };
  }) || [];

  // Get entity summary from API response
  const entities = analysisData?.entity_summary || [];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-accent-foreground";
      case "low": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "critical": return "bg-destructive text-destructive-foreground";
      case "pending": return "bg-accent text-accent-foreground";
      case "review": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Project Analysis Dashboard</h1>
              <p className="text-muted-foreground">{projectName}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Success Probability */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Success Probability</span>
                </CardTitle>
                <CardDescription>AI-predicted project success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="hsl(var(--muted))"
                          strokeWidth="12"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={`${successProbability * 3.39} 339.292`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-foreground">{successProbability}%</div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {successDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 lg:col-span-2">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Overview of project health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{keyMetrics.stakeholders}</div>
                    <div className="text-sm text-muted-foreground">Stakeholders</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{keyMetrics.documents}</div>
                    <div className="text-sm text-muted-foreground">Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{keyMetrics.days_left}</div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{keyMetrics.risks}</div>
                    <div className="text-sm text-muted-foreground">Risks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* AI Insights */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>AI-Generated Insights</span>
                </CardTitle>
                <CardDescription>Key risks and opportunities identified</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.length > 0 ? insights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getSeverityColor(insight.severity)} bg-current/10`}>
                        <insight.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No insights available yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Entity/Relation Summary */}
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <CardTitle>Entity Summary</CardTitle>
                <CardDescription>
                  Quick overview of extracted entities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-bold text-foreground">{keyMetrics.total_entities}</div>
                    <div className="text-sm text-muted-foreground">Total Entities</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <div className="text-2xl font-bold text-foreground">
                      {keyMetrics.total_connections}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Connections</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {entities.length > 0 ? (
                    <>
                      {entities.slice(0, 3).map((entity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {entity.id}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground text-sm">{entity.name}</h4>
                              <p className="text-xs text-muted-foreground">{entity.type}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(entity.status)} variant="secondary">
                            {entity.status}
                          </Badge>
                        </div>
                      ))}
                      {entities.length > 3 && (
                        <Button variant="outline" className="w-full">
                          View All {entities.length} Entities
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No entities extracted yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Graph Viewer - Full Width */}
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-primary" />
                    <span>Interactive Knowledge Graph</span>
                  </CardTitle>
                  <CardDescription>
                    Explore relationships between stakeholders, tasks, and milestones
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Fullscreen
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <InteractiveGraph graphData={analysisData?.knowledge_graph} />
            </CardContent>
          </Card>

          {/* Entity/Relation Table - Full Width */}
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 mt-8">
            <CardHeader>
              <CardTitle>Extracted Entities & Relations</CardTitle>
              <CardDescription>
                Key entities identified from your project communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entities.length > 0 ? entities.map((entity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {entity.id}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{entity.name}</h4>
                        <p className="text-sm text-muted-foreground">{entity.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{entity.connections} connections</p>
                        <p className="text-xs text-muted-foreground">{entity.description || 'in network'}</p>
                      </div>
                      <Badge className={getStatusColor(entity.status)}>
                        {entity.status}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No entities extracted yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
