import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAccountability } from '@/context/AccountabilityContext';
import { useWallet } from '@/context/WalletContext';
import { Actor } from '@/types/accountability';

export default function CreateRequest() {
  const navigate = useNavigate();
  const { createRequest, isLoading } = useAccountability();
  const { wallet, connect, isConnecting } = useWallet();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actors, setActors] = useState<{ address: string; label: string }[]>([
    { address: '', label: '' },
  ]);
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [minimumApprovals, setMinimumApprovals] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addActor = () => {
    setActors([...actors, { address: '', label: '' }]);
  };

  const removeActor = (index: number) => {
    if (actors.length > 1) {
      setActors(actors.filter((_, i) => i !== index));
    }
  };

  const updateActor = (index: number, field: 'address' | 'label', value: string) => {
    const updated = [...actors];
    updated[index][field] = value;
    setActors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    const validActors = actors.filter((a) => a.address.trim());
    if (validActors.length === 0) {
      setError('At least one actor with a wallet address is required');
      return;
    }

    if (!deadline) {
      setError('Deadline is required');
      return;
    }

    const deadlineDate = new Date(`${deadline}T${deadlineTime}`);
    if (deadlineDate <= new Date()) {
      setError('Deadline must be in the future');
      return;
    }

    if (minimumApprovals > validActors.length) {
      setError('Minimum approvals cannot exceed the number of actors');
      return;
    }

    try {
      const formattedActors: Actor[] = validActors.map((a) => ({
        address: a.address.trim(),
        label: a.label.trim() || undefined,
        hasApproved: false,
      }));

      const id = await createRequest({
        title: title.trim(),
        description: description.trim(),
        actors: formattedActors,
        deadline: deadlineDate,
        minimumApprovals,
        createdBy: wallet.address!,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/request/${id}`);
      }, 1500);
    } catch (err) {
      setError('Failed to create request. Please try again.');
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Created</h2>
          <p className="text-muted-foreground">Recording to Cardano blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Accountability Request</h1>
          <p className="text-muted-foreground">
            Define who must act, what they must do, and the deadline for action.
          </p>
        </div>

        {!wallet.connected && (
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-warning mb-1">Wallet Required</p>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your Cardano testnet wallet to create accountability requests.
              </p>
              <Button variant="wallet" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('open-wallet-dialog'))} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Action Title</Label>
            <Input
              id="title"
              placeholder="e.g., Approve Youth Project Funds"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what action is required and why it matters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Required Actors</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addActor}>
                <Plus className="w-4 h-4" />
                Add Actor
              </Button>
            </div>
            
            <div className="space-y-3">
              {actors.map((actor, index) => (
                <div key={index} className="flex gap-3 items-start animate-slide-in">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Wallet address (addr_test1...)"
                      value={actor.address}
                      onChange={(e) => updateActor(index, 'address', e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Input
                      placeholder="Label (optional, e.g., Treasury Lead)"
                      value={actor.label}
                      onChange={(e) => updateActor(index, 'label', e.target.value)}
                    />
                  </div>
                  {actors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeActor(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline Date</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={today}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlineTime">Deadline Time</Label>
              <Input
                id="deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Minimum Approvals */}
          <div className="space-y-2">
            <Label htmlFor="minimumApprovals">Minimum Approvals Required</Label>
            <div className="flex items-center gap-4">
              <Input
                id="minimumApprovals"
                type="number"
                min={1}
                max={actors.filter((a) => a.address.trim()).length || 1}
                value={minimumApprovals}
                onChange={(e) => setMinimumApprovals(parseInt(e.target.value) || 1)}
                className="w-24 h-12"
              />
              <span className="text-sm text-muted-foreground">
                out of {actors.filter((a) => a.address.trim()).length || 1} actors
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full"
            disabled={isLoading || !wallet.connected}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Request...
              </>
            ) : (
              'Create Accountability Request'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
