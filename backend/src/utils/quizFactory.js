const rotate = (values, offset) => values.map((_, index) => values[(index + offset) % values.length]);

const withAnswer = (question, correct, distractors, explanation, difficulty = 'Medium', offset = 0) => {
  const options = rotate([correct, ...distractors], offset % 4);
  return { question, options, correctAnswer: options.indexOf(correct), explanation, difficulty };
};

export function buildQuizzesForCourse(course) {
  return (course.modules || []).flatMap((module, moduleIndex) => {
    const lesson = module.lessons?.at(-1);
    if (!lesson) return [];
    const nearbyModules = (course.modules || []).filter((item) => item.moduleId !== module.moduleId).map((item) => item.title);
    const distractorModules = [...nearbyModules, 'Unrelated reference material', 'Skipping all practice', 'Account preferences'].slice(0, 3);
    const offset = moduleIndex % 4;
    return [{
      course: course._id,
      moduleId: module.moduleId,
      lessonId: lesson.lessonId,
      title: `${module.title} Assessment`,
      passingMarks: 60,
      timeLimit: 10,
      isPublished: true,
      questions: [
        withAnswer(`Which topic is the main focus of this module?`, module.title, distractorModules, `This assessment checks the concepts covered throughout ${module.title}.`, 'Easy', offset),
        withAnswer(`Which lesson concludes the ${module.title} module?`, lesson.title, ['Course enrollment', 'Account settings', 'Certificate verification'], `${lesson.title} is the final lesson attached to this module assessment.`, 'Easy', offset + 1),
        withAnswer('What is the best way to reinforce a newly learned concept?', 'Apply it in a practical exercise', ['Skip directly to the certificate', 'Avoid reviewing mistakes', 'Memorize terms without context'], 'Practical application and review build durable understanding.', 'Medium', offset + 2),
        withAnswer('What should you do after answering an assessment question incorrectly?', 'Review the explanation and revisit the concept', ['Ignore the feedback', 'Select random answers next time', 'Stop the course immediately'], 'Reviewing explanations turns mistakes into useful learning feedback.', 'Medium', offset + 3),
        withAnswer(`Which action best demonstrates mastery of ${lesson.title}?`, 'Explain and apply the concept independently', ['Only watch the video title', 'Leave every answer blank', 'Skip the learning material'], 'Being able to explain and apply a concept is stronger evidence of mastery than passive exposure.', 'Hard', offset),
      ],
    }];
  });
}
