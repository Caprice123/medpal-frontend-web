import { useState, useEffect } from 'react'
import {
  InputWrapper,
  Label,
  RequiredMark,
  InputContainer,
  CurrencyPrefix,
  StyledInput,
  HintText,
  ErrorText
} from './CurrencyInput.styles'

/**
 * Reusable CurrencyInput component with IDR prefix
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {boolean} props.required - Show required asterisk
 * @param {string|number} props.value - Input value (can be string or number)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the input
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.currency - Currency symbol (default: 'Rp')
 * @param {string} props.name - Input name
 * @param {string} props.className - Additional CSS class
 */
function CurrencyInput({
  label,
  required = false,
  value = '',
  onChange,
  onBlur,
  placeholder = '0',
  disabled = false,
  error = '',
  hint = '',
  currency = 'Rp',
  name,
  className = '',
  min = 0,
  ...rest
}) {
  const [displayValue, setDisplayValue] = useState('')

  // Format number with thousand separators
  const formatNumber = (num) => {
    if (!num) return ''
    const numStr = num.toString().replace(/\D/g, '')
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse formatted string to number
  const parseNumber = (str) => {
    return str.replace(/\./g, '')
  }

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const numValue = value.toString().replace(/\D/g, '')
      setDisplayValue(formatNumber(numValue))
    }
  }, [value])

  const handleChange = (e) => {
    const inputValue = e.target.value
    const rawValue = parseNumber(inputValue)

    // Update display
    setDisplayValue(formatNumber(rawValue))

    // Call parent onChange with raw number
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          value: rawValue
        }
      })
    }
  }

  return (
    <InputWrapper className={className}>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <InputContainer>
        <CurrencyPrefix>{currency}</CurrencyPrefix>
        <StyledInput
          type="text"
          name={name}
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          hasError={!!error}
          {...rest}
        />
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && <HintText>{hint}</HintText>}
    </InputWrapper>
  )
}

export default CurrencyInput
