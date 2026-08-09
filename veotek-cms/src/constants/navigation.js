import {
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    path: "/services",
    icon: Wrench,
  },
  {
    label: "Portfolio",
    path: "/portfolio",
    icon: FolderKanban,
  },
  {
    label: "Blog",
    path: "/blog",
    icon: BriefcaseBusiness,
  },
  {
    label: "Team",
    path: "/team",
    icon: Users,
  },
  
{
  label: "Testimonial Submissions",
  path: "/testimonial-submissions",
  icon: MessageSquareQuote,
},

{
    label: "Messages",
    path: "/messages",
    icon: Mail,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];