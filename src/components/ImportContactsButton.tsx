import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const ImportContactsButton = ({ onContactsFetched }) => {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/contacts.readonly',
    onSuccess: async (tokenResponse) => {
      const res = await fetch(
        'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const data = await res.json();
      const contacts = (data.connections || []).map(contact => ({
        name: contact.names?.[0]?.displayName ?? '',
        email: contact.emailAddresses?.[0]?.value ?? '',
      })).filter(c => c.email);
      onContactsFetched(contacts);
    },
    onError: (err) => {
      alert('Failed to authenticate with Google: ' + JSON.stringify(err));
    },
  });

  return (
    <Button size="sm" variant="outline" onClick={() => login()} className="flex items-center gap-2">
      <Mail className="h-4 w-4 mr-1" />
      Import from Contacts
    </Button>
  );
};

export default ImportContactsButton; 