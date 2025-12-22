import Chatbot from '../index'

export class ChatbotRoute {
    static moduleRoute = "/chatbot"
}

export const chatbotRoutes = [
    { path: ChatbotRoute.moduleRoute, element: <Chatbot /> },
]
