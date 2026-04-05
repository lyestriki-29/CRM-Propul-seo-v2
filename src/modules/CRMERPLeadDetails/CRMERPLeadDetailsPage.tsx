import { LeadHeader } from './components/LeadHeader';
import { LeadInfo } from './components/LeadInfo';
import { LeadActivities } from './components/LeadActivities';
import { LeadAssign } from './components/LeadAssign';
import type { CRMERPLead, CRMERPActivity, ActivityType } from './types';

interface User { id: string; name: string; email: string }

interface Props {
  lead: CRMERPLead;
  activities: CRMERPActivity[];
  users: User[];
  onBack: () => void;
  onEdit: () => void;
  onAssign: (userId: string | null) => void;
  onAddActivity: (type: ActivityType, content: string) => Promise<void>;
  onUpdateActivity: (id: string, updates: { type?: ActivityType; content?: string }) => Promise<void>;
  onDeleteActivity: (id: string) => Promise<void>;
}

export function CRMERPLeadDetailsPage({
  lead, activities, users,
  onBack, onEdit, onAssign,
  onAddActivity, onUpdateActivity, onDeleteActivity,
}: Props) {
  return (
    <div className="min-h-screen">
      <LeadHeader lead={lead} onBack={onBack} onEdit={onEdit} />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <LeadInfo lead={lead} />
            <LeadAssign assigneeId={lead.assignee_id} users={users} onAssign={onAssign} />
          </div>
          <div className="lg:col-span-2">
            <LeadActivities
              activities={activities}
              onAdd={onAddActivity}
              onUpdate={onUpdateActivity}
              onDelete={onDeleteActivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
