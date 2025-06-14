import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Bell,
  Globe,
  Lock,
  Palette,
  CreditCard,
  Shield,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const defaultSettings = {
  // General
  platformName: 'Slash Experiences',
  platformDescription: 'Your premium experience marketplace',
  contactEmail: 'contact@example.com',
  allowRegistration: true,
  emailVerification: true,
  defaultRole: 'user',
  // Appearance
  primaryColor: '#000000',
  logo: null as string | null,
  favicon: null as string | null,
  // Notification
  notifyUser: true,
  notifyBooking: true,
  notifySystem: true,
  // Security
  twoFA: false,
  sessionTimeout: true,
  sessionDuration: 30,
  // Billing
  plan: 'pro',
  paymentMethod: '•••• •••• •••• 4242',
  billingEmail: 'billing@example.com'
};

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(type, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Information</CardTitle>
                  <CardDescription>
                    Update your platform's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input 
                      id="platform-name" 
                      value={settings.platformName} 
                      onChange={(e) => handleChange('platformName', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-description">Description</Label>
                    <Textarea
                      id="platform-description"
                      value={settings.platformDescription}
                      onChange={(e) => handleChange('platformDescription', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      value={settings.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Configure user registration and management settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable new user registrations
                      </p>
                    </div>
                    <Switch 
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleChange('allowRegistration', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require email verification for new users
                      </p>
                    </div>
                    <Switch 
                      checked={settings.emailVerification}
                      onCheckedChange={(checked) => handleChange('emailVerification', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default User Role</Label>
                    <Select 
                      value={settings.defaultRole}
                      onValueChange={(value) => handleChange('defaultRole', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input 
                    id="primary-color" 
                    type="color" 
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Platform Logo</Label>
                  <div className="flex items-center gap-4">
                    {settings.logo && (
                      <div className="relative w-20 h-20">
                        <img 
                          src={settings.logo} 
                          alt="Platform Logo" 
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => handleChange('logo', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input 
                        id="logo" 
                        type="file" 
                        accept="image/*"
                        ref={logoInputRef}
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended size: 200x200px, Max size: 2MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-4">
                    {settings.favicon && (
                      <div className="relative w-8 h-8">
                        <img 
                          src={settings.favicon} 
                          alt="Favicon" 
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => handleChange('favicon', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input 
                        id="favicon" 
                        type="file" 
                        accept="image/*"
                        ref={faviconInputRef}
                        onChange={(e) => handleFileChange(e, 'favicon')}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended size: 32x32px, Max size: 1MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure email notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new user registrations
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifyUser}
                    onCheckedChange={(checked) => handleChange('notifyUser', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new bookings
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifyBooking}
                    onCheckedChange={(checked) => handleChange('notifyBooking', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for system updates
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifySystem}
                    onCheckedChange={(checked) => handleChange('notifySystem', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch 
                    checked={settings.twoFA}
                    onCheckedChange={(checked) => handleChange('twoFA', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Switch 
                    checked={settings.sessionTimeout}
                    onCheckedChange={(checked) => handleChange('sessionTimeout', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input 
                    id="session-duration" 
                    type="number" 
                    value={settings.sessionDuration}
                    onChange={(e) => handleChange('sessionDuration', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your billing and subscription settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Current Plan</Label>
                  <Select 
                    value={settings.plan}
                    onValueChange={(value) => handleChange('plan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Input 
                    id="payment-method" 
                    value={settings.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Billing Email</Label>
                  <Input 
                    id="billing-email" 
                    type="email" 
                    value={settings.billingEmail}
                    onChange={(e) => handleChange('billingEmail', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings; 