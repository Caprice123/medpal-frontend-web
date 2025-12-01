import { useDispatch, useSelector } from "react-redux"
import { actions } from '@store/user/reducer'
import { fetchUsers } from "../../../../../store/user/action"
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'

export const Filter = () => {
    const { filter } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    return (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "flex-end" }}>
            <div>
                <TextInput
                    label="Email"
                    placeholder="Enter email..."
                    value={filter.email}
                    onChange={(e) => actions.updateFilter(e.target.value)}
                />
            </div>

            <div>
                <Button variant="primary" size="medium" onClick={() => dispatch(fetchUsers())}>Search</Button>
            </div>
        </div>
    )
}