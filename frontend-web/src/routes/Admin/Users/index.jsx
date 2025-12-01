import { useSelector } from "react-redux"
import Table from "../../../components/common/Table"
import { Badge } from "../../UITest/UITest.styles"
import Button from '@components/common/Button'
import { useUserSection } from "./hooks/useUserSection"
import {
  Container,
  Content,
  GroupsContainer,
} from './Tags.styles'
import { Filter } from "./components/Filter"

function Users() {
  const { users, loading } = useSelector(state => state.user)
  const {
    uiState,
    useAdjustCredit,
    useAdjustSubscription,
  } = useUserSection()

  return (
    <Container>
        <Filter />
      <Content>
          <GroupsContainer>
            <Table
                loading={loading.isGetListUsersLoading}
                emptyText="Belum ada pengguna."
                emptySubtext=""
                data={users}
                columns={[{
                    key: "name",
                    header: "Nama",
                }, {
                    key: "email",
                    header: "Email"
                }, {
                    key: "isActive",
                    header: "Active",
                    align: 'center',
                    render: (isActive) => (
                        <Badge variant={isActive ? 'success' : 'error'}>
                            {isActive ? "true" : "false"}
                        </Badge>
                    )
                }, {
                    key: "",
                    header: "Aksi",
                    render: (user) => (
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <Button variant="primary" size="medium" onClick={() => useAdjustCredit.onOpen(user)}>Adjust Credit</Button>
                            <Button variant="primary" size="medium" onClick={() => useAdjustSubscription.onOpen(user)}>Adjust Subscription</Button>
                        </div>
                    )
                }]}
            />
          </GroupsContainer>
      </Content>
    </Container>
  )
}

export default Users