import axios from 'axios';
import { config } from '../config/env';

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
  templateName?: string;
  templateParams?: string[];
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
  data?: any;
}

export class WhatsAppService {
  private apiKey: string;
  private apiUrl: string;
  private axios;

  constructor() {
    this.apiKey = config.WHATSAPP_API_KEY || process.env.WHATSAPP_API_KEY || '';
    this.apiUrl = config.WHATSAPP_API_URL || process.env.WHATSAPP_API_URL || 'https://1confirmed.com/api/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️  1Confirmed API key not configured. Messages will not be sent.');
    }

    // Configure axios instance for 1Confirmed API
    this.axios = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log(`🔧 1Confirmed WhatsApp Service initialized with URL: ${this.apiUrl}`);
  }

  /**
   * Send a text message via 1Confirmed WhatsApp API
   */
  async sendTextMessage(to: string, message: string): Promise<WhatsAppResponse> {
    try {
      if (!this.apiKey) {
        console.log('📝 WhatsApp message (API key not configured):', { to, message });
        return {
          success: false,
          error: 'WhatsApp API key not configured'
        };
      }

      // Format phone number (ensure it has country code but without +)
      const formattedNumber = this.formatPhoneNumber(to);
      
      console.log(`📱 Sending WhatsApp message via 1Confirmed to ${formattedNumber}`);
      console.log(`📝 Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);

      // 1Confirmed API payload structure (based on your Postman request)
      const payload = {
        language_id: 3,  // English
        template_id: 97, // Default template ID
        phone: formattedNumber,
        data: {
          broadcast_template_image: "https://1confirmed.com/images/default_template_img.jpeg",
          phone: formattedNumber,
          message: message
        }
      };

      console.log('📤 Sending payload to 1Confirmed:', JSON.stringify(payload, null, 2));

      const response = await this.axios.post('/messages', payload);

      console.log('📥 1Confirmed API Response:', response.data);

      if (response.status === 200) {
        console.log(`✅ WhatsApp message sent successfully via 1Confirmed`);
        
        return {
          success: true,
          messageId: response.data?.id || 'message_sent',
          status: 'sent',
          data: response.data
        };
      } else {
        console.error('❌ Unexpected response status:', response.status);
        return {
          success: false,
          error: `Unexpected response status: ${response.status}`
        };
      }

    } catch (error: any) {
      console.error('❌ 1Confirmed WhatsApp message failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 
               error.response?.data?.error || 
               error.message || 
               'Failed to send WhatsApp message via 1Confirmed'
      };
    }
  }

  /**
   * Send a template message via 1Confirmed API
   */
  async sendTemplateMessage(
    to: string, 
    templateId: number = 97,
    customMessage?: string,
    imageUrl?: string
  ): Promise<WhatsAppResponse> {
    try {
      if (!this.apiKey) {
        console.log('📝 WhatsApp template message (API key not configured):', { to, templateId });
        return {
          success: false,
          error: 'WhatsApp API key not configured'
        };
      }

      const formattedNumber = this.formatPhoneNumber(to);
      
      console.log(`📱 Sending WhatsApp template ${templateId} via 1Confirmed to ${formattedNumber}`);

      const payload = {
        language_id: 3,
        template_id: templateId,
        phone: formattedNumber,
        data: {
          broadcast_template_image: imageUrl || "https://1confirmed.com/images/default_template_img.jpeg",
          phone: formattedNumber,
          message: customMessage || "Hello from NotifyWise!"
        }
      };

      const response = await this.axios.post('/messages', payload);

      if (response.status === 200) {
        console.log(`✅ WhatsApp template sent successfully via 1Confirmed`);
        
        return {
          success: true,
          messageId: response.data?.id || 'template_sent',
          status: 'sent',
          data: response.data
        };
      } else {
        return {
          success: false,
          error: `Unexpected response status: ${response.status}`
        };
      }

    } catch (error: any) {
      console.error('❌ 1Confirmed WhatsApp template failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 
               error.response?.data?.error || 
               error.message || 
               'Failed to send WhatsApp template via 1Confirmed'
      };
    }
  }

  /**
   * Send appointment confirmation message using 1Confirmed
   */
  async sendAppointmentConfirmation(
    to: string,
    clientName: string,
    service: string,
    appointmentDate: Date,
    businessName: string
  ): Promise<WhatsAppResponse> {
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const message = `🎉 Appointment Confirmed!

Hello ${clientName}! 👋

Your appointment has been successfully booked:

📅 Service: ${service}
🗓️  Date: ${formattedDate}
🕐 Time: ${formattedTime}
🏢 Business: ${businessName}

We're excited to see you! 

If you need to reschedule or have any questions, please don't hesitate to contact us.

Thank you for choosing ${businessName}! ✨`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send appointment reminder message using 1Confirmed
   */
  async sendAppointmentReminder(
    to: string,
    clientName: string,
    service: string,
    appointmentDate: Date,
    businessName: string,
    reminderType: '24h' | '2h' | '30m' = '24h'
  ): Promise<WhatsAppResponse> {
    const formattedDate = appointmentDate.toLocaleDateString('en-US');
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    let timeText = '';
    let emoji = '';
    
    switch (reminderType) {
      case '24h':
        timeText = 'tomorrow';
        emoji = '📅';
        break;
      case '2h':
        timeText = 'in 2 hours';
        emoji = '⏰';
        break;
      case '30m':
        timeText = 'in 30 minutes';
        emoji = '🔔';
        break;
    }

    const message = `${emoji} Appointment Reminder

Hi ${clientName}! 

This is a friendly reminder about your appointment ${timeText}:

📋 Service: ${service}
📅 Date: ${formattedDate}
🕐 Time: ${formattedTime}
🏢 Location: ${businessName}

We look forward to seeing you! 😊

If you need to reschedule, please contact us as soon as possible.

See you soon! 👋`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Send follow-up message after appointment using 1Confirmed
   */
  async sendFollowUpMessage(
    to: string,
    clientName: string,
    service: string,
    businessName: string
  ): Promise<WhatsAppResponse> {
    const message = `💙 Thank You!

Hi ${clientName}! 

Thank you for choosing ${businessName} for your ${service} today.

We hope you had an excellent experience with us! 

🌟 Your feedback means the world to us. If you have a moment, we'd love to hear about your experience.

We'd be delighted to see you again soon! 

Best regards,
The ${businessName} Team ✨`;

    return this.sendTextMessage(to, message);
  }

  /**
   * Test the 1Confirmed API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          message: '1Confirmed API key not configured'
        };
      }

      console.log('🔍 Testing 1Confirmed API connection...');

      // Test with a simple message to a test number
      const testPayload = {
        language_id: 3,
        template_id: 97,
        phone: "212600000000", // Test number format
        data: {
          broadcast_template_image: "https://1confirmed.com/images/default_template_img.jpeg",
          phone: "212600000000",
          message: "API Connection Test from NotifyWise"
        }
      };

      // Just test the API structure, don't actually send
      console.log('📤 Test payload structure:', JSON.stringify(testPayload, null, 2));
      
      return {
        success: true,
        message: '1Confirmed API configuration is valid',
        data: {
          apiUrl: this.apiUrl,
          hasApiKey: !!this.apiKey,
          testPayload: testPayload
        }
      };

    } catch (error: any) {
      console.error('❌ 1Confirmed API test failed:', error.message);
      return {
        success: false,
        message: error.message || '1Confirmed API connection test failed'
      };
    }
  }

  /**
   * Format phone number for 1Confirmed API (without + prefix)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // If number doesn't start with country code, assume it's Morocco (212)
    if (cleaned.length === 9) {
      cleaned = '212' + cleaned; // Morocco country code
    } else if (cleaned.length === 10) {
      cleaned = '1' + cleaned; // US/Canada country code
    }
    
    console.log(`📞 Formatted phone number: ${phoneNumber} -> ${cleaned}`);
    return cleaned;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const isValid = cleaned.length >= 10 && cleaned.length <= 15;
    console.log(`✅ Phone number validation: ${phoneNumber} -> ${isValid}`);
    return isValid;
  }

  /**
   * Get message delivery status (if 1Confirmed provides this endpoint)
   */
  async getMessageStatus(messageId: string): Promise<any> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: '1Confirmed API key not configured'
        };
      }

      // Note: Check 1Confirmed documentation for actual status endpoint
      const response = await this.axios.get(`/messages/${messageId}/status`);
      return {
        success: true,
        data: response.data
      };

    } catch (error: any) {
      console.error('❌ Failed to get message status from 1Confirmed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();