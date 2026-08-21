export function buildAssignmentsForCourse(course) {
  return (course.modules || []).flatMap((module, moduleIndex) => {
    const lesson = module.lessons?.at(-1);
    if (!lesson) return [];
    return [{
      course: course._id,
      moduleId: module.moduleId,
      lessonId: lesson.lessonId,
      title: `${module.title} Practical Assignment`,
      description: `Apply the key concepts from ${module.title} in a concise practical submission.`,
      instructions: `Review the module lessons, complete the practice task for “${lesson.title}”, and upload one PDF, DOC, DOCX, or ZIP file. Include your reasoning, key steps, and final result.`,
      dueDate: new Date(Date.UTC(2030, moduleIndex, 28)),
      maxMarks: 100,
      attachments: (lesson.resources || []).slice(0, 2).map((resource) => ({ title: resource.title, url: resource.url, type: resource.type })),
      isPublished: true,
    }];
  });
}
