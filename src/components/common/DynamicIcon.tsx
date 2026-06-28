import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className }: DynamicIconProps) {
  // Safe lookup for the icon component from lucide-react exports
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Default fallback icon
    const Fallback = Icons.Link2;
    return <Fallback className={className} />;
  }
  
  return <IconComponent className={className} />;
}
