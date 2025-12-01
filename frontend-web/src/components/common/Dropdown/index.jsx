import ReactDropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { DropdownWrapper } from './Dropdown.styles'

/**
 * Centralized Dropdown component using react-dropdown
 *
 * @param {Object} props
 * @param {Array} props.options - Array of options: [{ value: string, label: string }] or ['option1', 'option2']
 * @param {Object|string} props.value - Selected value (can be option object or string)
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the dropdown
 * @param {boolean} props.hasError - Show error state
 * @param {string} props.className - Additional CSS class
 */
function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  hasError = false,
  className = ''
}) {
  return (
    <DropdownWrapper hasError={hasError} className={className}>
      <ReactDropdown
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </DropdownWrapper>
  )
}

export default Dropdown
