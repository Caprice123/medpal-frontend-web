import React, { memo } from 'react'
import { FaSave, FaFileWord } from 'react-icons/fa'
import BlockNoteEditor from '@components/BlockNoteEditor'
import {
  EditorPanel as StyledEditorPanel,
  EditorActions,
  SaveButton,
  ExportButton,
  EditorContent as StyledEditorContent
} from '../Editor.styles'

const EditorPanel = memo(({
  editorContent,
  onContentChange,
  onImageUpload,
  hasUnsavedChanges,
  isSavingContent,
  onSave,
  onExportWord,
  isLoadingContent
}) => {
  if (isLoadingContent) {
    return (
      <StyledEditorPanel>
        <EditorActions>
          <SaveButton disabled>
            <FaSave /> Simpan
          </SaveButton>
          <ExportButton disabled>
            <FaFileWord /> Export Word
          </ExportButton>
        </EditorActions>
        <StyledEditorContent>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            Memuat konten editor...
          </div>
        </StyledEditorContent>
      </StyledEditorPanel>
    )
  }

  return (
    <StyledEditorPanel>
      <EditorActions>
        <SaveButton onClick={onSave} disabled={!hasUnsavedChanges || isSavingContent}>
          <FaSave /> {isSavingContent ? 'Menyimpan...' : 'Simpan'}
        </SaveButton>
        <ExportButton onClick={onExportWord}>
          <FaFileWord /> Export Word
        </ExportButton>
      </EditorActions>

      <StyledEditorContent>
        <BlockNoteEditor
          initialContent={editorContent}
          onChange={onContentChange}
          onImageUpload={onImageUpload}
          editable={true}
          placeholder="Mulai menulis skripsi Anda di sini..."
        />
      </StyledEditorContent>
    </StyledEditorPanel>
  )
})

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel
