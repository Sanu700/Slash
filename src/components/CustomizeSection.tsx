
import { useState, useEffect } from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Gift, Calendar, Heart, PenLine, Sparkles, Mail } from 'lucide-react';
import { categories } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';

const CustomizeSection = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { toast } = useToast();
  
  // Form states
  const [recipient, setRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryType, setDeliveryType] = useState('email');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Preview card state
  const [previewStyle, setPreviewStyle] = useState('classic');
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user.id || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleSavePersonalization = async () => {
    if (!recipient) {
      toast({
        title: "Recipient name required",
        description: "Please enter a recipient name to save your personalization.",
        variant: "destructive",
      });
      return;
    }
    
    if (deliveryType === 'email' && !recipientEmail) {
      toast({
        title: "Recipient email required",
        description: "Please enter a recipient email for email delivery.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('gift_personalizations').insert({
        user_id: userId,
        recipient_name: recipient,
        category,
        message: giftMessage,
        delivery_method: deliveryType,
        card_style: previewStyle,
        recipient_email: recipientEmail,
      });
      
      if (error) throw error;
      
      toast({
        title: "Personalization saved",
        description: "Your gift personalization has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving personalization:', error);
      toast({
        title: "Error saving personalization",
        description: "There was an error saving your personalization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <section 
      id="customize"
      ref={ref} 
      className="py-20 md:py-28"
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-medium mb-4 transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Personalize Your Gift
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Create a truly special gift by adding your personal touch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Gift Customization Form */}
          <div 
            className={cn(
              "transition-all duration-700 delay-200",
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient's Name</Label>
                <Input 
                  id="recipient" 
                  placeholder="Enter recipient's name" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Gift Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Write your personal message here..." 
                  className="min-h-[120px]"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Delivery Method</Label>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <Button 
                    type="button" 
                    variant={deliveryType === 'email' ? 'default' : 'outline'} 
                    className="justify-start"
                    onClick={() => setDeliveryType('email')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Email
                  </Button>
                  <Button 
                    type="button" 
                    variant={deliveryType === 'print' ? 'default' : 'outline'} 
                    className="justify-start"
                    onClick={() => setDeliveryType('print')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer mr-2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    Print at Home
                  </Button>
                </div>
              </div>
              
              {deliveryType === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient's Email</Label>
                  <Input 
                    id="recipientEmail" 
                    type="email"
                    placeholder="Enter recipient's email" 
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Card Style</Label>
                <div className="grid grid-cols-3 gap-4 pt-1">
                  {['classic', 'modern', 'playful'].map((style) => (
                    <div 
                      key={style}
                      className={cn(
                        "relative border rounded-lg p-3 cursor-pointer transition-all",
                        previewStyle === style 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "hover:border-gray-300"
                      )}
                      onClick={() => setPreviewStyle(style)}
                    >
                      <div className="aspect-[4/3] mb-2 bg-secondary rounded-md overflow-hidden flex items-center justify-center">
                        {style === 'classic' && <Gift className="h-6 w-6 opacity-60" />}
                        {style === 'modern' && <Sparkles className="h-6 w-6 opacity-60" />}
                        {style === 'playful' && <Heart className="h-6 w-6 opacity-60" />}
                      </div>
                      <div className="text-xs capitalize text-center">{style}</div>
                      {previewStyle === style && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleSavePersonalization}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Personalization"}
              </Button>
            </div>
          </div>
          
          {/* Preview */}
          <div 
            className={cn(
              "transition-all duration-700 delay-300 perspective",
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            <div className={cn(
              "bg-white rounded-xl overflow-hidden shadow-xl preserve-3d hover:rotate-y-[-5deg] hover:scale-105 transition-all duration-500",
              previewStyle === 'classic' && "border border-gray-200",
              previewStyle === 'modern' && "border-0",
              previewStyle === 'playful' && "border-2 border-indigo-200 shadow-indigo-100"
            )}>
              {/* Card header */}
              <div className={cn(
                "p-6 relative",
                previewStyle === 'classic' && "bg-primary text-white", 
                previewStyle === 'modern' && "bg-gradient-to-r from-gray-900 to-gray-800 text-white",
                previewStyle === 'playful' && "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              )}>
                <div className="absolute top-6 right-6">
                  {previewStyle === 'classic' && <Gift className="h-8 w-8 opacity-60" />}
                  {previewStyle === 'modern' && <Sparkles className="h-8 w-8 opacity-70" />}
                  {previewStyle === 'playful' && <Heart className="h-8 w-8 opacity-70" />}
                </div>
                
                <div className="mb-2 text-sm opacity-80">A Special Gift For</div>
                <h3 className="text-2xl font-medium mb-1">
                  {recipient || 'Your Recipient'}
                </h3>
                
                <div className="flex items-center mt-4 text-sm opacity-80">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Valid for 12 months</span>
                </div>
              </div>
              
              {/* Card body */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <PenLine className="h-4 w-4 mr-2" />
                    Personal Message
                  </div>
                  <p className="italic text-gray-600">
                    {giftMessage || "Your personal message will appear here..."}
                  </p>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {category 
                      ? `Selected Category: ${categories.find(c => c.id === category)?.name}` 
                      : "Select a gift category"}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Delivery Method: {deliveryType === 'email' ? 'Email' : 'Print at Home'}
                  </div>
                  {deliveryType === 'email' && recipientEmail && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {recipientEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizeSection;
