'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  Clock,
  Shield,
  Zap,
  Star,
  Menu,
  X,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Rocket,
  Crown,
  Diamond
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

const floatingElements = [
  { icon: MessageCircle, delay: 0, position: 'top-1/4 left-1/4' },
  { icon: Calendar, delay: 1, position: 'top-1/3 right-1/4' },
  { icon: Users, delay: 2, position: 'bottom-1/4 left-1/3' },
  { icon: Clock, delay: 3, position: 'bottom-1/3 right-1/3' },
];

const stats = [
  { number: '50K+', label: 'Messages Sent', icon: MessageCircle, color: 'text-green-500' },
  { number: '2K+', label: 'Happy Businesses', icon: Users, color: 'text-blue-500' },
  { number: '99.9%', label: 'Uptime', icon: Shield, color: 'text-purple-500' },
  { number: '85%', label: 'Reduced No-Shows', icon: TrendingUp, color: 'text-orange-500' }
];

const features = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Integration',
    description: 'Send professional appointment reminders directly via WhatsApp Business API with 99% delivery rate.',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    delay: 0.1
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered scheduling with automatic reminders sent at optimal times for maximum engagement.',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    delay: 0.2
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Comprehensive client database with advanced analytics and behavioral insights.',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    delay: 0.3
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards with predictive analytics and business intelligence.',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    delay: 0.4
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Stunning responsive interface optimized for every device and screen size.',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    delay: 0.5
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Military-grade encryption with SOC 2 compliance and advanced threat protection.',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    delay: 0.6
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    business: 'Premium Hair Salon',
    content: 'NotifyWise transformed our business! 90% reduction in no-shows and clients absolutely love the WhatsApp reminders.',
    rating: 5,
    avatar: '/api/placeholder/64/64',
    verified: true
  },
  {
    name: 'Dr. Michael Chen',
    business: 'Medical Practice',
    content: 'The analytics dashboard is incredible. We\'ve optimized our scheduling and increased patient satisfaction by 40%.',
    rating: 5,
    avatar: '/api/placeholder/64/64',
    verified: true
  },
  {
    name: 'Lisa Rodriguez',
    business: 'Elite Tutoring Service',
    content: 'Professional, reliable, and beautiful. Our clients think we\'ve upgraded to a Fortune 500 level service.',
    rating: 5,
    avatar: '/api/placeholder/64/64',
    verified: true
  }
];

export default function PremiumLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950" />
        
        {/* Floating orbs */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${element.position} w-20 h-20 opacity-10 dark:opacity-5`}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                delay: element.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-full h-full text-purple-500" />
            </motion.div>
          );
        })}

        {/* Cursor follower */}
        <motion.div
          className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-50"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-white/20 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NotifyWise
                </span>
                <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                  PRO
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Features', 'Pricing', 'Reviews', 'Demo'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={`#${item.toLowerCase()}`} 
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <ThemeToggle />
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-purple-50 dark:hover:bg-purple-950">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="premium" size="lg" className="shadow-lg hover:shadow-xl">
                  Start Free Trial
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {['Features', 'Pricing', 'Reviews', 'Demo'].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item.toLowerCase()}`} 
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    {item}
                  </Link>
                ))}
                <div className="px-3 py-2 space-y-2">
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button variant="premium" className="w-full">
                      Start Free Trial
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          style={{ y: y1, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full mb-6">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                #1 WhatsApp Appointment Platform
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                Never Miss an
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Appointment
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                Again
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your business with AI-powered WhatsApp automation. 
              Reduce no-shows by 85%, increase client satisfaction, and scale your operations effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/auth/register">
                <Button 
                  variant="premium" 
                  size="xl" 
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="glass" size="xl" className="group">
                  <span className="flex items-center">
                    Watch Demo
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                99.9% Uptime SLA
              </div>
              <div className="flex items-center">
                <Diamond className="w-4 h-4 mr-2" />
                Enterprise Ready
              </div>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card variant="glass" className="p-6 h-full">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color === 'text-green-500' ? 'from-green-500 to-emerald-600' : stat.color === 'text-blue-500' ? 'from-blue-500 to-cyan-600' : stat.color === 'text-purple-500' ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-red-600'} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Floating action elements */}
        <motion.div
          className="absolute top-1/2 left-10 hidden lg:block"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Card variant="glass" className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live notifications</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-10 hidden lg:block"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          <Card variant="glass" className="p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">85% less no-shows</span>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ y: y2 }}
        >
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Powerful Features
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Everything You Need to
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dominate Your Industry
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Advanced features designed by industry experts to give you the competitive edge you deserve.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card variant="gradient" className="h-full p-8 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-full mb-6">
              <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Customer Success Stories
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Join Thousands of
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Successful Businesses
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card variant="glass" className="h-full p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </span>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
                        )}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.business}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join the revolution. Start your free trial today and experience the power of automated WhatsApp marketing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/register">
              <Button 
                variant="glass" 
                size="xl" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <span className="flex items-center">
                  Start Free Trial - No Credit Card
                  <Target className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white/50 text-white hover:bg-white/10"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
          
          <p className="text-purple-200 text-sm mt-6">
            ✨ 14-day free trial • ✨ Cancel anytime • ✨ No setup fees
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">NotifyWise</span>
                <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The world's most advanced WhatsApp appointment reminder platform. 
                Trusted by thousands of businesses worldwide.
              </p>
              <div className="flex space-x-4">
                {/* Social links would go here */}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/api-docs" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NotifyWise. All rights reserved. Built with ❤️ for ambitious businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}