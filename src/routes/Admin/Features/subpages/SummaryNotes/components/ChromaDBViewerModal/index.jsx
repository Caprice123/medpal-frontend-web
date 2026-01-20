import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchEmbeddings } from '@store/summaryNotes/action'
import {
  ModalOverlay,
  ModalContainer,
  Header,
  Title,
  Badge,
  CloseButton,
  Content,
  EmbeddingsList,
  EmbeddingCard,
  CardHeader,
  CardTitle,
  CardMeta,
  MetaItem,
  MetaLabel,
  MetaValue,
  ContentPreview,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  LoadingState,
  Footer,
  PaginationInfo,
  PaginationButtons,
  PageButton
} from './ChromaDBViewer.styles'

function ChromaDBViewerModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { embeddings, embeddingsPagination, loading } = useSelector(state => state.summaryNotes)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchEmbeddings(1, 20))
    }
  }, [isOpen, dispatch])

  const handlePageChange = (newPage) => {
    dispatch(fetchEmbeddings(newPage, 20))
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return '-'
    }
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '-'
    const kb = bytes / 1024
    return `${kb.toFixed(2)} KB`
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            ChromaDB Viewer
            <Badge>{embeddingsPagination.totalCount || 0} dokumen</Badge>
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          {loading.isEmbeddingsLoading ? (
            <LoadingState>
              <div>Memuat embeddings...</div>
            </LoadingState>
          ) : embeddings.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <EmptyTitle>Tidak Ada Embeddings</EmptyTitle>
              <EmptyDescription>
                Belum ada summary notes yang di-publish. Publish summary notes untuk mulai membuat embeddings.
              </EmptyDescription>
            </EmptyState>
          ) : (
            <EmbeddingsList>
              {embeddings.map((embedding) => (
                <EmbeddingCard key={embedding.id}>
                  <CardHeader>
                    <CardTitle>
                      {embedding.title}
                      {embedding.sectionHeading && ` → ${embedding.sectionHeading}`}
                    </CardTitle>
                  </CardHeader>

                  <CardMeta>
                    <MetaItem>
                      <MetaLabel>Note ID</MetaLabel>
                      <MetaValue>{embedding.noteId}</MetaValue>
                    </MetaItem>
                    {embedding.chunkIndex !== undefined && (
                      <MetaItem>
                        <MetaLabel>Chunk</MetaLabel>
                        <MetaValue>
                          {embedding.chunkIndex + 1} / {embedding.totalChunks}
                        </MetaValue>
                      </MetaItem>
                    )}
                    {embedding.parentHeading && (
                      <MetaItem>
                        <MetaLabel>Parent Section</MetaLabel>
                        <MetaValue>{embedding.parentHeading}</MetaValue>
                      </MetaItem>
                    )}
                    <MetaItem>
                      <MetaLabel>Embedding Dimension</MetaLabel>
                      <MetaValue>{embedding.embeddingDimension} dims</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Content Length</MetaLabel>
                      <MetaValue>{embedding.contentLength} chars</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Created At</MetaLabel>
                      <MetaValue>{formatDate(embedding.createdAt)}</MetaValue>
                    </MetaItem>
                  </CardMeta>

                  {embedding.content && (
                    <ContentPreview>{embedding.content}</ContentPreview>
                  )}
                </EmbeddingCard>
              ))}
            </EmbeddingsList>
          )}
        </Content>

        {embeddings.length > 0 && (
          <Footer>
            <PaginationInfo>
              Halaman {embeddingsPagination.page} dari {embeddingsPagination.totalPages || 1}
              {' '}• Total {embeddingsPagination.totalCount} dokumen
            </PaginationInfo>
            <PaginationButtons>
              <PageButton
                onClick={() => handlePageChange(embeddingsPagination.page - 1)}
                disabled={embeddingsPagination.page === 1 || loading.isEmbeddingsLoading}
              >
                ← Sebelumnya
              </PageButton>
              <PageButton
                onClick={() => handlePageChange(embeddingsPagination.page + 1)}
                disabled={embeddingsPagination.isLastPage || loading.isEmbeddingsLoading}
              >
                Selanjutnya →
              </PageButton>
            </PaginationButtons>
          </Footer>
        )}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default ChromaDBViewerModal
