import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from "@store/calculator/reducer"
import { getCalculatorTopics } from '../../../../../../store/calculator/action'

export const Filter = () => {
    const dispatch = useDispatch()
    const { filter } = useSelector(state => state.calculator)
    const { tags } = useSelector(state => state.tags)

    const onSearch = () => {
        dispatch(getCalculatorTopics())
    }

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
            <form onSubmit={e => {
                e.preventDefault()
                onSearch()
            }}>
                <FilterComponent>
                    <FilterComponent.Group>
                        <FilterComponent.Label>Nama Kalkulator</FilterComponent.Label>
                        <TextInput
                            placeholder="Cari kalkulator berdasarkan nama..."
                            value={filter.name || ''}
                            onChange={(e) => dispatch(actions.updateFilter({ key: "name", value: e.target.value }))}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    onSearch()
                                }
                            }}
                        />
                    </FilterComponent.Group>

                    <FilterComponent.Group>
                        <FilterComponent.Label>Kategori</FilterComponent.Label>
                        <Dropdown
                            options={tags?.[0]?.tags?.map((tag) => ({ label: tag.name, value: tag.name })) || []}
                            value={filter.tagName ? { label: filter.tagName, value: filter.tagName } : null}
                            onChange={(option) => dispatch(actions.updateFilter({ key: "tagName", value: option?.value || "" }))}
                            placeholder="Filter berdasarkan kategori..."
                        />
                    </FilterComponent.Group>
                </FilterComponent>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    marginTop: '1rem'
                }}>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={onSearch}
                    >
                        🔍 Cari
                    </Button>
                </div>
            </form>
        </div>
    )
}
