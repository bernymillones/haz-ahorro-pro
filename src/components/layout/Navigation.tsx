import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, History, User } from "lucide-react";
const navItems = [{
  path: "/",
  label: "Mis Ahorros",
  icon: Home
}, {
  path: "/nuevo",
  label: "Nuevo Ahorro",
  icon: PlusCircle
}, {
  path: "/historial",
  label: "Historial",
  icon: History
}, {
  path: "/perfil",
  label: "Perfil",
  icon: User
}];
export default function Navigation() {
  const location = useLocation();
  return <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-primary">AHORROS</span>
              <span className="text-foreground"> HD.O</span>
              <span className="text-muted-foreground text-3xl">💰</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>;
          })}
          </div>

          {/* Mobile Navigation Toggle - could add hamburger menu here */}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex gap-1 overflow-x-auto">
          {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>;
        })}
        </div>
      </div>
    </nav>;
}
