'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  BarChart3,
  Plus,
  Bell,
  Crown,
  TrendingUp,
  Clock,
  Zap,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  Activity,
  Target,
  Award,
  Rocket,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Share,
  Menu,
  X,
  Search,
  User,
  LogOut,
  CreditCard,
  Shield,
  Globe,
  CheckCircle
} from 'lucide-react';

// Modal Components
const AddClientModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
    dateOfBirth: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Client added successfully!",
          description: `${formData.firstName} ${formData.lastName} has been added to your client list.`,
          variant: "success",
        });
        onSuccess();
        onClose();
        setFormData({ firstName: '', lastName: '', email: '', whatsappNumber: '', dateOfBirth: '', notes: '' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add client');
      }
    } catch (error: any) {
      toast({
        title: "Failed to add client",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 rounded-2xl border border-white/10 p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add New Client</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
            <input
              type="tel"
              required
              value={formData.whatsappNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, whatsappNumber: value });
              }}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {loading ? 'Adding...' : 'Add Client'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ScheduleModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    service: '',
    appointmentDate: '',
    duration: '60',
    notes: '',
    clientId: ''
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Fetch clients for dropdown
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          client: formData.clientId || undefined
        })
      });

      if (response.ok) {
        toast({
          title: "Appointment scheduled!",
          description: "Your appointment has been successfully scheduled.",
          variant: "success",
        });
        onSuccess();
        onClose();
        setFormData({ service: '', appointmentDate: '', duration: '60', notes: '', clientId: '' });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to schedule appointment');
      }
    } catch (error: any) {
      toast({
        title: "Failed to schedule appointment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 rounded-2xl border border-white/10 p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Schedule Appointment</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
            <input
              type="text"
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Consultation, Meeting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client (Optional)</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select a client...</option>
              {clients.map((client: any) => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, business, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: 0,
    totalClients: 0,
    messagesSent: 0,
    successRate: '--'
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchDashboardData();
    }
  }, [loading, user]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch multiple endpoints
      const [appointmentsRes, clientsRes, messagesRes] = await Promise.all([
        fetch('/api/appointments?limit=100', { credentials: 'include' }),
        fetch('/api/clients', { credentials: 'include' }),
        fetch('/api/messages/stats', { credentials: 'include' })
      ]);

      let todayAppointments = 0;
      let totalClients = 0;
      let messagesSent = 0;
      let successRate = '--';

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        const appointments = appointmentsData.data || [];
        const today = new Date().toDateString();
        todayAppointments = appointments.filter((apt: any) => 
          new Date(apt.appointmentDate).toDateString() === today
        ).length;
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        totalClients = clientsData.data?.length || 0;
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        messagesSent = messagesData.data?.totalSent || 0;
        successRate = messagesData.data?.successRate ? `${messagesData.data.successRate}%` : '--';
      }

      setDashboardData({
        todayAppointments,
        totalClients,
        messagesSent,
        successRate
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: "Dashboard refreshed",
      description: "Your data has been updated.",
      variant: "success",
    });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-client':
        setShowAddClient(true);
        break;
      case 'schedule':
        setShowSchedule(true);
        break;
      case 'configure':
        router.push('/dashboard/settings');
        break;
      case 'view-plans':
        router.push('/dashboard/billing');
        break;
      case 'notifications':
        setShowNotifications(!showNotifications);
        break;
      default:
        toast({
          title: "Feature coming soon!",
          description: `The ${action} feature will be available in the next update.`,
          variant: "default",
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Today's Appointments",
      value: dashboardData.todayAppointments.toString(),
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      onClick: () => handleNavigation('/dashboard/appointments')
    },
    {
      title: "Total Clients",
      value: dashboardData.totalClients.toString(),
      icon: Users,
      color: "from-green-500 to-emerald-600",
      onClick: () => handleNavigation('/dashboard/clients')
    },
    {
      title: "Messages Sent",
      value: dashboardData.messagesSent.toString(),
      icon: MessageSquare,
      color: "from-purple-500 to-pink-600",
      onClick: () => handleNavigation('/dashboard/messages')
    },
    {
      title: "Success Rate",
      value: dashboardData.successRate,
      icon: Target,
      color: "from-orange-500 to-red-600",
      onClick: () => handleNavigation('/dashboard/analytics')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NotifyWise</h1>
                <p className="text-xs text-purple-300">Premium Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => handleQuickAction('notifications')}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
              
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                </Button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation('/dashboard/profile')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation('/dashboard/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleNavigation('/dashboard/billing')}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing
                    </Button>
                    <hr className="my-2 border-white/10" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-red-400 hover:text-red-300"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {business?.name}! 👋
          </h2>
          <p className="text-gray-300">
            Here's what's happening with your appointment reminders today.
          </p>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={stat.onClick}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-purple-400" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Complete these steps to start sending appointment reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h4 className="font-medium">Add your first client</h4>
                    <p className="text-sm text-gray-400">
                      Start by adding client information
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('add-client')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h4 className="font-medium">Schedule an appointment</h4>
                    <p className="text-sm text-gray-400">
                      Create your first appointment
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('schedule')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h4 className="font-medium">Configure WhatsApp</h4>
                    <p className="text-sm text-gray-400">
                      Set up your messaging preferences
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('configure')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest appointments and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    No activity yet. Start by adding your first client!
                  </p>
                  <Button 
                    onClick={() => handleQuickAction('add-client')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trial Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">🎉 Welcome to your 14-day free trial!</h3>
                    <p className="text-purple-100">
                      You have full access to all features. Upgrade anytime to continue after your trial.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleQuickAction('view-plans')}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddClient && (
          <AddClientModal
            isOpen={showAddClient}
            onClose={() => setShowAddClient(false)}
            onSuccess={() => {
              fetchDashboardData();
              toast({
                title: "Success!",
                description: "Client added successfully. Your dashboard has been updated.",
                variant: "success",
              });
            }}
          />
        )}

        {showSchedule && (
          <ScheduleModal
            isOpen={showSchedule}
            onClose={() => setShowSchedule(false)}
            onSuccess={() => {
              fetchDashboardData();
              toast({
                title: "Success!",
                description: "Appointment scheduled successfully. Your dashboard has been updated.",
                variant: "success",
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Welcome to NotifyWise!</p>
                    <p className="text-xs text-gray-400 mt-1">Complete your setup to start sending reminders</p>
                    <p className="text-xs text-gray-500 mt-2">Just now</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Account Created Successfully</p>
                    <p className="text-xs text-gray-400 mt-1">Your NotifyWise account is ready to use</p>
                    <p className="text-xs text-gray-500 mt-2">2 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Free Trial Started</p>
                    <p className="text-xs text-gray-400 mt-1">Your 14-day free trial is now active</p>
                    <p className="text-xs text-gray-500 mt-2">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowNotifications(false)}
              >
                Mark all as read
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Overlay */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}