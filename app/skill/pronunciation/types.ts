export interface Topic {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  icon: string;
  color: string;
  bgImage: string;
  cssClass?: string;
}

export interface NavItemProps {
  topic: Topic;
  isActive: boolean;
  onClick: () => void;
}
