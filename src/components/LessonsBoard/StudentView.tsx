import React from 'react';
import { LessonGroup } from '../LessonGroup';
import { LessonBlock } from '../LessonBlock';
import { Lesson, LessonGroupType } from '../../types/lessons';

interface StudentViewProps {
  lessons: Lesson[];
  lessonGroups: LessonGroupType[];
  isLoading: boolean;
}

export const StudentView: React.FC<StudentViewProps> = ({ 
  lessons, 
  lessonGroups, 
  isLoading 
}) => {
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!lessonGroups || lessonGroups.length === 0) {
    return <div className="empty-state">No lessons available</div>;
  }

  return (
    <div className="lessons-container">
      {lessonGroups.map((group) => (
        <LessonGroup
          key={group.id}
          title={group.title}
          lessons={lessons.filter(lesson => lesson.groupId === group.id)}
          renderLesson={(lesson) => (
            <LessonBlock
              key={lesson.id}
              lesson={lesson}
              onClick={() => window.location.href = `/lessons/${lesson.id}`}
            />
          )}
        />
      ))}
    </div>
  );
};
