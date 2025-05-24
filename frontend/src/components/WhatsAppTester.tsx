'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare,
  Send,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  Zap
} from 'lucide-react';

export default function WhatsAppTester() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    message: 'Hello! This is a test message from NotifyWise. 🚀'
  });
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSendTest = async () => {
    if (!formData.phoneNumber || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please enter both phone number and message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/messages/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          data: data.data
        });
        toast({
          title: "Message sent successfully! 🎉",
          description: "Your test message was sent via 1Confirmed.",
          variant: "success",
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Test message error:', error);
      setTestResult({
        success: false,
        error: error.message
      });
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/messages/test-connection', {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "1Confirmed API Connected! ✅",
          description: "Your API configuration is working correctly.",
          variant: "success",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Integration Test</h2>
        <p className="text-gray-300">Test your 1Confirmed WhatsApp API integration</p>
      </div>

      {/* Connection Test */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            API Connection Test
          </CardTitle>
          <CardDescription className="text-gray-300">
            Verify your 1Confirmed API configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleTestConnection}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Test 1Confirmed Connection
          </Button>
        </CardContent>
      </Card>

      {/* Message Test */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
            Send Test Message
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send a real WhatsApp message via 1Confirmed API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="+212600000000 or 0600000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use Morocco format: +212600000000 or 0600000000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="Enter your test message..."
            />
          </div>

          <Button
            onClick={handleSendTest}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Test Message via 1Confirmed
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`bg-black/20 backdrop-blur-xl border-white/10 ${
            testResult.success ? 'border-green-500/30' : 'border-red-500/30'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center ${
                testResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                Test Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResult.success ? (
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">✅ Message Sent Successfully!</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><strong>Phone:</strong> {testResult.data.phoneNumber}</p>
                      <p><strong>Message ID:</strong> {testResult.data.messageId}</p>
                      <p><strong>Status:</strong> {testResult.data.status}</p>
                      <p><strong>Provider:</strong> {testResult.data.provider}</p>
                      <p><strong>Sent At:</strong> {new Date(testResult.data.sentAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {testResult.data.apiResponse && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">📡 API Response</h4>
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(testResult.data.apiResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">❌ Test Failed</h4>
                  <p className="text-gray-300 text-sm">{testResult.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">📋 Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-sm space-y-2">
          <p><strong>1.</strong> Make sure you have your 1Confirmed API key in your .env file:</p>
          <code className="block bg-gray-800 p-2 rounded text-green-400">
            WHATSAPP_API_KEY=your_actual_1confirmed_api_key
          </code>
          <p><strong>2.</strong> Phone numbers should be in international format (with country code)</p>
          <p><strong>3.</strong> For Morocco: use +212600000000 or 0600000000</p>
          <p><strong>4.</strong> Check your 1Confirmed dashboard for message delivery status</p>
        </CardContent>
      </Card>
    </div>
  );
}