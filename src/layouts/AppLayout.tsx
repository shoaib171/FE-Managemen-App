
import { ThemeProvider } from 'next-themes';
import { useReduxTasks } from '@/hooks/useReduxTasks';
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
import { cn } from '@/lib/utils';
import { 
  ListTodo, 
  CircleDashed, 
  CheckCircle,
  Github,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppContent({ children }: AppLayoutProps) {
  const { filter, changeFilter } = useReduxTasks();

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
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-background">
            <SidebarTrigger />
            <ThemeToggle />
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
