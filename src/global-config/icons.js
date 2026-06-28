import React from 'react';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  MessageSquareIcon,
  FolderOpenIcon,
  BarChart3Icon,
  ScrollTextIcon,
  SettingsIcon,
  UserCheckIcon,
  TrendingUpIcon,
  HistoryIcon,
  MailIcon,
  BellIcon,
  HelpCircleIcon
} from 'lucide-react';

const iconRegistry = {
  dashboard: LayoutDashboardIcon,
  underwriting: FileTextIcon,
  claims: ShieldCheckIcon,
  payments: CreditCardIcon,
  communications: MessageSquareIcon,
  documents: FolderOpenIcon,
  analytics: BarChart3Icon,
  audit: ScrollTextIcon,
  settings: SettingsIcon,
  userCheck: UserCheckIcon,
  trending: TrendingUpIcon,
  history: HistoryIcon,
  mail: MailIcon,
  bell: BellIcon,
  help: HelpCircleIcon,
};

export function ConfigIcon({ name, className, ...props }) {
  const IconComponent = iconRegistry[name] || ShieldCheckIcon;
  return <IconComponent className={className} {...props} />;
}
