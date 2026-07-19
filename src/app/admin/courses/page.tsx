import { prisma } from '@/lib/prisma';
import CourseManager from '@/components/admin/CourseManager';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <CourseManager initialCourses={courses} />
  );
}
