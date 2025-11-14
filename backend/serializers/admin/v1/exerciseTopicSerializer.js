export class ExerciseTopicSerializer {
    static serialize(topic) {
        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            type: topic.content_type,
            content_type: topic.content_type,
            content: topic.content,
            pdf_url: topic.pdf_url,
            tags: topic.tags.map(tag => ({
                id: tag.tag ? tag.tag.id : tag.id,
                name: tag.tag ? tag.tag.name : tag.name,
                type: tag.tag ? tag.tag.type : tag.type
            })),
            questions: topic.questions ? topic.questions.map((q, index) => ({
                id: q.id,
                question: q.question,
                answer: q.answer,
                explanation: q.explanation || '',
                order: q.order !== undefined ? q.order : index
            })) : [],
            questionCount: topic.questions ? topic.questions.length : 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
        }
    }
}