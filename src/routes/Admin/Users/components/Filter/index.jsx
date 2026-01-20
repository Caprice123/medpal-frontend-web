import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from "@store/user/reducer"
import { fetchUsers } from '../../../../../store/user/action'

export const Filter = () => {
    const dispatch = useDispatch()
    const { filter } = useSelector(state => state.user)

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ]

    const onSearch = () => {
        dispatch(actions.setPage(1))
        dispatch(fetchUsers())
    }

    return (
        <form onSubmit={e => {
            e.preventDefault()
            onSearch()
        }}>
            <FilterComponent>
                <FilterComponent.Group>
                    <FilterComponent.Label>Email</FilterComponent.Label>
                    <TextInput
                        placeholder="Search by email..."
                        value={filter.email || ''}
                        onChange={(e) => dispatch(actions.updateFilter({ key: "email", value: e.target.value }))}
                    />
                </FilterComponent.Group>

                <FilterComponent.Group>
                    <FilterComponent.Label>Name</FilterComponent.Label>
                    <TextInput
                        placeholder="Search by name..."
                        value={filter.name || ''}
                        onChange={(e) => dispatch(actions.updateFilter({ key: "name", value: e.target.value }))}
                    />
                </FilterComponent.Group>

                <FilterComponent.Group>
                    <FilterComponent.Label>Status</FilterComponent.Label>
                    <Dropdown
                        options={statusOptions}
                        value={filter.status}
                        onChange={(option) => dispatch(actions.updateFilter({ key: "status", value: option }))}
                        placeholder="Select status..."
                    />
                </FilterComponent.Group>
            </FilterComponent>

            <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end'
            }}>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={onSearch}
                >
                    🔍 Search
                </Button>
            </div>
        </form>
    )
}