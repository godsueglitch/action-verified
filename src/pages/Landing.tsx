import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  FileCheck, 
  Eye, 
  AlertTriangle,
  Database,
  CheckCircle,
  Users,
  Fingerprint
} from 'lucide-react';
import { useAccountability } from '@/context/AccountabilityContext';

export default function Landing() {
  const { loadDemoScenario } = useAccountability();

  const useCases = [
    {
      icon: Clock,
      title: 'Delayed Approvals',
      description: 'Track when officials miss critical sign-off deadlines for community projects.',
    },
    {
      icon: FileCheck,
      title: 'Ignored Fund Sign-offs',
      description: 'Document treasury members who fail to approve or reject disbursement requests.',
    },
    {
      icon: Users,
      title: 'Absent Officials',
      description: 'Record committee members who consistently miss required action deadlines.',
    },
    {
      icon: AlertTriangle,
      title: 'Missed Compliance',
      description: 'Prove when mandatory regulatory filings are ignored by responsible parties.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Immutable Records',
      description: 'Once recorded on Cardano, proof of absence cannot be altered or deleted.',
    },
    {
      icon: Eye,
      title: 'Public Verification',
      description: 'Anyone can verify accountability records through the blockchain.',
    },
    {
      icon: Database,
      title: 'No Tokens Required',
      description: 'Pure accountability logic. No cryptocurrencies, no financial complexity.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-accountability" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Fingerprint className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Accountability Infrastructure on Cardano</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Making silence{' '}
              <span className="text-gradient">accountable</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Proof of Absence records when required actions are missed. 
              Silence becomes data. Inaction becomes evidence. 
              Forever on the blockchain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Launch App
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => {
                  loadDemoScenario();
                  window.location.href = '/dashboard';
                }}
              >
                Demo Scenario
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-World Accountability</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From community organizations to public institutions, 
              Proof of Absence creates irrefutable records of inaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cardano Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Cardano?</h2>
              <p className="text-lg text-muted-foreground">
                Built on a blockchain designed for real-world applications and formal verification.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-card border border-border">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Formal Verification</h3>
                  <p className="text-muted-foreground">
                    Cardano's Plutus smart contracts use formal methods to mathematically prove correctness. 
                    Your accountability records are protected by the same rigorous standards used in aerospace and medical systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Recording Accountability
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect your Cardano testnet wallet to create your first accountability request. 
              No tokens needed, no fees required for testing.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/create">
                Create Accountability Request
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Proof of Absence — Accountability Infrastructure on Cardano Testnet
            </p>
            <p className="text-sm text-muted-foreground">
              Built for transparency. Powered by Cardano.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
