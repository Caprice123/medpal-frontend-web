export class ExerciseTopicSerializer {
    static serialize(topic) {
        // Handle both old and new relation names
        const topicTags = topic.exercise_topic_tags || topic.tags || [];
        const topicQuestions = topic.exercise_questions || topic.questions || [];

        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            type: topic.content_type,
            content_type: topic.content_type,
            content: topic.content,
            // Support both blob object (new) and pdf_url (legacy)
            blob: topic.blob || null,
            pdf_url: topic.pdf_url || topic.blob?.url || null, // Backward compatibility
            tags: topicTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                type: tag.tags ? tag.tags.type : (tag.tag ? tag.tag.type : tag.type)
            })),
            questions: topicQuestions.map((q, index) => ({
                id: q.id,
                question: q.question,
                answer: q.answer,
                explanation: q.explanation || '',
                order: q.order !== undefined ? q.order : index
            })),
            questionCount: topicQuestions.length,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
        }
    }
}