import FlashcardListPage from '../pages/List';
import FlashcardDetailPage from '../pages/Detail';

export class FlashcardRoute {
    static moduleRoute = "/flashcards"
    static initialRoute = FlashcardRoute.moduleRoute
    static detailRoute = FlashcardRoute.moduleRoute + "/:id"
}

export const flashcardRoutes = [
    { path: FlashcardRoute.initialRoute, element: <FlashcardListPage /> },
    { path: FlashcardRoute.detailRoute, element: <FlashcardDetailPage /> },
];
