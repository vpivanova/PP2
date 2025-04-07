import React from 'react';
import { LessonGroupType } from '../../types/lessons';
import { AdminLessonGroup } from '../AdminLessonGroup';
import { AdminLessonBlock } from '../AdminLessonBlock';

interface AdminViewProps {
  lessonGroups: LessonGroupType[];
  lessonBlocks: any[];
  lessonGroupLoader: any;
}

const AdminView: React.FC<AdminViewProps> = ({ lessonGroups, lessonBlocks, lessonGroupLoader }) => {
  return (
    <div className="admin-view-container">
      {lessonGroups.map(group => (
        <AdminLessonGroup key={group.id} group={group}>
          {lessonBlocks.filter(block => block.groupId === group.id).map(block => (
            <AdminLessonBlock key={block.id} block={block}/>
          ))}
        </AdminLessonGroup>
      ))}
    </div>
  );
}

export default AdminView;
