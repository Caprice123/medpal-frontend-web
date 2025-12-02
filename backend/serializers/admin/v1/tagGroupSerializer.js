import { TagSerializer } from "./tagSerializer.js"

export class TagGroupSerializer {
    static serialize(tagGroups) {
        if (!Array.isArray(tagGroups)) {
            return []
        }

        return tagGroups.map((tag_group, index) => ({
            id: tag_group.id,
            name: tag_group.name,
            tags: TagSerializer.serialize(tag_group.tags)
        }))
    }
}