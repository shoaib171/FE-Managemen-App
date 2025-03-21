
import { AppLayout } from '@/layouts/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'team_lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    }
  };
  
  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 animate-enter-from-left">
          My Profile
        </h1>
        
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              View and manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getRoleBadge(user.role)}`}>
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    {user.role.replace('_', ' ').charAt(0).toUpperCase() + user.role.replace('_', ' ').slice(1)}
                  </span>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground pt-2">
                  Account ID: {user._id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
