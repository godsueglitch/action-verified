import { useAccountability } from '@/context/AccountabilityContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const { requests, loadDemoScenario } = useAccountability();
  const navigate = useNavigate();

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled').length;
  const failedRequests = requests.filter(r => r.status === 'failed').length;

  const approvalRate = totalRequests > 0 
    ? Math.round((fulfilledRequests / (fulfilledRequests + failedRequests || 1)) * 100) 
    : 0;

  const totalActors = requests.reduce((sum, r) => sum + r.actors.length, 0);
  const approvedActors = requests.reduce(
    (sum, r) => sum + r.actors.filter(a => a.hasApproved).length, 
    0
  );
  const actorResponseRate = totalActors > 0 
    ? Math.round((approvedActors / totalActors) * 100) 
    : 0;

  const avgApprovals = totalRequests > 0
    ? (requests.reduce((sum, r) => sum + r.actors.filter(a => a.hasApproved).length, 0) / totalRequests).toFixed(1)
    : '0';

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: BarChart3,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      title: 'Pending',
      value: pendingRequests,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    {
      title: 'Fulfilled',
      value: fulfilledRequests,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      title: 'Failed',
      value: failedRequests,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
    },
  ];

  const insights = [
    {
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      description: 'Percentage of finalized requests that were fulfilled',
      icon: TrendingUp,
      trend: approvalRate >= 70 ? 'positive' : approvalRate >= 40 ? 'neutral' : 'negative',
    },
    {
      title: 'Actor Response Rate',
      value: `${actorResponseRate}%`,
      description: 'Percentage of actors who submitted approvals',
      icon: Users,
      trend: actorResponseRate >= 70 ? 'positive' : actorResponseRate >= 40 ? 'neutral' : 'negative',
    },
    {
      title: 'Avg. Approvals/Request',
      value: avgApprovals,
      description: 'Average number of approvals per request',
      icon: Activity,
      trend: 'neutral',
    },
    {
      title: 'Absence Events',
      value: failedRequests,
      description: 'Requests that failed due to inaction',
      icon: AlertTriangle,
      trend: failedRequests === 0 ? 'positive' : failedRequests <= 2 ? 'neutral' : 'negative',
    },
  ];

  if (totalRequests === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Analytics Dashboard</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              No accountability data to analyze yet. Create requests or load demo data to see statistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" onClick={() => navigate('/create')}>
                Create First Request
              </Button>
              <Button variant="outline" onClick={loadDemoScenario}>
                Load Demo Data
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track accountability metrics and approval patterns across all requests.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`${stat.bgColor} border ${stat.borderColor}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Insights */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Insights</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {insights.map((insight) => {
            const Icon = insight.icon;
            const trendColors = {
              positive: 'text-success',
              neutral: 'text-warning',
              negative: 'text-destructive',
            };
            return (
              <Card key={insight.title} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {insight.title}
                    </CardTitle>
                    <span className={`text-2xl font-bold ${trendColors[insight.trend]}`}>
                      {insight.value}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{insight.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Requests</h2>
        <div className="space-y-3">
          {requests.slice(0, 5).map((request) => (
            <Card 
              key={request.id} 
              className="card-hover cursor-pointer"
              onClick={() => navigate(`/request/${request.id}`)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{request.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {request.actors.filter(a => a.hasApproved).length}/{request.actors.length} approvals
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'fulfilled' 
                      ? 'bg-success/10 text-success' 
                      : request.status === 'failed'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {request.status === 'fulfilled' ? 'Fulfilled' : request.status === 'failed' ? 'Failed' : 'Pending'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
