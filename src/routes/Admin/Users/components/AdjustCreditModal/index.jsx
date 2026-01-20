import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import {
  FormGroup,
  Label,
  ErrorText,
  HintText,
  UserInfo,
  UserInfoLabel,
  UserInfoValue,
  ModalFooter
} from './AdjustCreditModal.styles'

function AdjustCreditModal({ isOpen, onClose, formik, user }) {
  const { loading } = useSelector(state => state.user)

  const handleSubmit = (e) => {
    e.preventDefault()
    formik.handleSubmit()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust User Credit"
      size="small"
    >
      <form onSubmit={handleSubmit}>
        {user && (
          <UserInfo>
            <UserInfoLabel>User</UserInfoLabel>
            <UserInfoValue>{user.name || user.email}</UserInfoValue>
            <UserInfoLabel style={{ marginTop: '0.5rem' }}>Email</UserInfoLabel>
            <UserInfoValue>{user.email}</UserInfoValue>
            <UserInfoLabel style={{ marginTop: '0.5rem' }}>Current Balance</UserInfoLabel>
            <UserInfoValue style={{
              fontSize: '1.25rem',
              color: (user.userCredits?.balance || 0) > 0 ? '#059669' : '#6b7280',
              fontWeight: 600
            }}>
              {user.userCredits?.balance || 0} Credits
            </UserInfoValue>
          </UserInfo>
        )}

        <FormGroup>
          <Label>Credit Amount</Label>
          <TextInput
            type="number"
            name="credit"
            placeholder="Enter credit amount (positive or negative)"
            value={formik.values.credit || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={formik.touched.credit && formik.errors.credit}
          />
          {formik.touched.credit && formik.errors.credit ? (
            <ErrorText>{formik.errors.credit}</ErrorText>
          ) : (
            <HintText>Use positive number to add credits, negative to deduct</HintText>
          )}
        </FormGroup>

        <ModalFooter>
          <Button type="button" onClick={onClose} disabled={loading.isAdjustCreditLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading.isAdjustCreditLoading}
          >
            {loading.isAdjustCreditLoading ? 'Adjusting...' : 'Adjust Credit'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default AdjustCreditModal
