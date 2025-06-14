import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState(user?.user_metadata?.full_name || 'Admin User');
  const [avatar, setAvatar] = React.useState(user?.user_metadata?.avatar_url || '/default-admin-avatar.png');

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="text-xl font-bold">{name}</div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
              <Button onClick={() => setShowModal(true)}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Avatar URL</label>
              <Input value={avatar} onChange={e => setAvatar(e.target.value)} />
            </div>
            <Button onClick={() => setShowModal(false)} className="w-full">Save</Button>
            <Button variant="outline" onClick={() => setShowModal(false)} className="w-full mt-2">Cancel</Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Profile; 