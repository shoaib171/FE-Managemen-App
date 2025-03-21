
import { ThemeProvider } from 'next-themes';
import { useReduxTasks } from '@/hooks/useReduxTasks';
import { useAuth } from '@/hooks/useAuth';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  ListTodo, 
  CircleDashed, 
  CheckCircle,
  Github,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppContent({ children }: AppLayoutProps) {
  const { filter, changeFilter } = useReduxTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { 
      title: 'All Tasks', 
      icon: ListTodo,
      filter: 'all' as const,
    },
    { 
      title: 'Active', 
      icon: CircleDashed,
      filter: 'active' as const,
    },
    { 
      title: 'Completed', 
      icon: CheckCircle,
      filter: 'completed' as const,
    },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="px-6 py-5">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      filter === item.filter && 
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => changeFilter(item.filter)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleProfileClick}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Profile & Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            
            {user && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-[120px]">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-background">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              {user && (
                <Avatar className="h-8 w-8 md:hidden" onClick={handleProfileClick}>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <ThemeToggle />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
