import React from 'react';
import { ContentType } from '../../types';
import { 
  FileText, 
  Image as ImageIcon, 
  FolderArchive, 
  Code2, 
  Link2 
} from 'lucide-react';

interface ContentTypeIconProps {
  type: ContentType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ 
  type, 
  className = '',
  size = 'md' 
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const currentSize = iconSizes[size];

  switch (type) {
    case 'image':
      return <ImageIcon className={`${currentSize} text-purple-400 ${className}`} />;
    case 'files':
      return <FolderArchive className={`${currentSize} text-emerald-400 ${className}`} />;
    case 'code':
      return <Code2 className={`${currentSize} text-cyan-400 ${className}`} />;
    case 'link':
      return <Link2 className={`${currentSize} text-blue-400 ${className}`} />;
    case 'text':
    default:
      return <FileText className={`${currentSize} text-gray-300 ${className}`} />;
  }
};

