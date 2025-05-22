import axios, { AxiosResponse } from 'axios';
import { config } from '../config/env';
import { WhatsAppResponse, IAppointment, IClient, IBusiness } from '../types';

// WhatsApp API client
class WhatsAppService {
  private apiKey: string;
  private baseUrl: string;
  private axiosInstance;

  constructor() {
    this.apiKey = config.WHATSAPP_API_KEY;
    this.baseUrl = config.WHATSAPP_API_URL;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`📱 WhatsApp API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('📱 WhatsApp API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`📱 WhatsApp API Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        console.error('📱 WhatsApp API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Check if WhatsApp service is configured
  public isConfigured(): boolean {
    return !!(this.apiKey && this.baseUrl);
  }

  // Send a simple text message
  public async sendMessage(
    to: string,
    message: string,
    businessId?: string
  ): Promise<WhatsAppResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('WhatsApp service is not configured. Please check your API key and URL.');
      }

      // Clean phone number (remove any non-numeric characters)
      const cleanNumber = to.replace(/\D/g, '');
      
      // Ensure number has country code (add default if missing)
      const phoneNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;

      const payload = {
        to: phoneNumber,
        type: 'text',
        text: {
          body: message
        },
        ...(businessId && { business_id: businessId })
      };

      const response: AxiosResponse = await this.axiosInstance.post('/messages', payload);

      return {
        success: true,
        message_id: response.data.messages?.[0]?.id,
        status: response.data.messages?.[0]?.message_status,
        details: response.data
      };
    } catch (error: any) {
      console.error('WhatsApp send message error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        details: error.response?.data
      };
    }
  }

  // Send appointment confirmation message
  public async sendConfirmation(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): Promise<WhatsAppResponse> {
    const message = this.generateConfirmationMessage(appointment, client, business);
    return await this.sendMessage(client.whatsappNumber, message, business._id);
  }

  // Send appointment reminder message
  public async sendReminder(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): Promise<WhatsAppResponse> {
    const message = this.generateReminderMessage(appointment, client, business);
    return await this.sendMessage(client.whatsappNumber, message, business._id);
  }

  // Send follow-up message
  public async sendFollowUp(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): Promise<WhatsAppResponse> {
    const message = this.generateFollowUpMessage(appointment, client, business);
    return await this.sendMessage(client.whatsappNumber, message, business._id);
  }

  // Generate confirmation message
  private generateConfirmationMessage(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): string {
    const appointmentDate = new Date(appointment.appointmentDate);
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

    return `🎉 Appointment Confirmed!

Hi ${client.firstName}! 

Your appointment has been confirmed:

📅 **Date:** ${formattedDate}
⏰ **Time:** ${formattedTime}
💼 **Service:** ${appointment.service}
🏢 **Business:** ${business.name}

${business.address ? `📍 **Location:** ${business.address}\n` : ''}${appointment.notes ? `📝 **Notes:** ${appointment.notes}\n` : ''}
Thank you for choosing ${business.name}! We look forward to seeing you.

Need to reschedule or cancel? Please call us or reply to this message.

---
${business.name}
${business.whatsappNumber}`;
  }

  // Generate reminder message
  private generateReminderMessage(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): string {
    const appointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `⏰ Appointment Reminder

Hi ${client.firstName}!

This is a friendly reminder about your upcoming appointment:

📅 **Tomorrow:** ${formattedDate}
⏰ **Time:** ${formattedTime}
💼 **Service:** ${appointment.service}
🏢 **Business:** ${business.name}

${business.address ? `📍 **Location:** ${business.address}\n` : ''}Please arrive 5-10 minutes early. 

Need to reschedule or cancel? Please let us know as soon as possible.

See you tomorrow!

---
${business.name}
${business.whatsappNumber}`;
  }

  // Generate follow-up message
  private generateFollowUpMessage(
    appointment: IAppointment,
    client: IClient,
    business: IBusiness
  ): string {
    return `🙏 Thank You!

Hi ${client.firstName}!

Thank you for visiting ${business.name} today for your ${appointment.service} appointment.

We hope you had a great experience with us!

⭐ **How did we do?**
We'd love to hear your feedback. Your review helps us improve our service.

📅 **Book your next appointment:**
Ready to schedule your next visit? Just reply to this message or call us.

${business.website ? `🌐 **Visit our website:** ${business.website}\n` : ''}
Thank you for choosing ${business.name}!

---
${business.name}
${business.whatsappNumber}`;
  }

  // Send template message (for 1CONFIRMED templates)
  public async sendTemplate(
    to: string,
    templateName: string,
    templateParams: Record<string, string>,
    businessId?: string
  ): Promise<WhatsAppResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('WhatsApp service is not configured.');
      }

      const cleanNumber = to.replace(/\D/g, '');
      const phoneNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;

      const payload = {
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US'
          },
          components: [
            {
              type: 'body',
              parameters: Object.keys(templateParams).map(key => ({
                type: 'text',
                text: templateParams[key]
              }))
            }
          ]
        },
        ...(businessId && { business_id: businessId })
      };

      const response: AxiosResponse = await this.axiosInstance.post('/messages', payload);

      return {
        success: true,
        message_id: response.data.messages?.[0]?.id,
        status: response.data.messages?.[0]?.message_status,
        details: response.data
      };
    } catch (error: any) {
      console.error('WhatsApp send template error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        details: error.response?.data
      };
    }
  }

  // Get message status
  public async getMessageStatus(messageId: string): Promise<WhatsAppResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('WhatsApp service is not configured.');
      }

      const response: AxiosResponse = await this.axiosInstance.get(`/messages/${messageId}`);

      return {
        success: true,
        status: response.data.status,
        details: response.data
      };
    } catch (error: any) {
      console.error('WhatsApp get message status error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        details: error.response?.data
      };
    }
  }

  // Validate phone number format
  public validatePhoneNumber(phoneNumber: string): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return /^\d{10,15}$/.test(cleanNumber);
  }

  // Format phone number for WhatsApp
  public formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
  }

  // Test WhatsApp connection
  public async testConnection(): Promise<WhatsAppResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'WhatsApp service is not configured.'
        };
      }

      // Try to get account info or send a test request
      const response: AxiosResponse = await this.axiosInstance.get('/account');

      return {
        success: true,
        details: response.data
      };
    } catch (error: any) {
      console.error('WhatsApp test connection error:', error);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        details: error.response?.data
      };
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
export default whatsappService;