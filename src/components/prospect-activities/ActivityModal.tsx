import { ProspectActivity } from '@/types/prospect-activity';
import { ActivityForm } from './ActivityForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    activity_date: string;
    activity_type: string;
    priority: string;
    status?: string;
    assigned_to?: string;
  }) => void;
  activity?: ProspectActivity;
  users?: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  users,
  loading = false
}) => {
  const isEditing = !!activity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'activité' : 'Nouvelle activité'}
          </DialogTitle>
        </DialogHeader>
        
        <ActivityForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialData={activity}
          users={users}
          loading={loading}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}; 