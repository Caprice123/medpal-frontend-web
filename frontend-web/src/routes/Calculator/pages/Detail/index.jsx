import React, { useEffect, useState } from 'react'
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  CalculatorsList,
  CalculatorCard,
  CalculatorTitle,
  CalculatorDescription,
  FieldCount,
  CalculatorForm,
  FormHeader,
  BackButton,
  FormTitle,
  FormDescription,
  InputsSection,
  SectionTitle,
  InputsGrid,
  FormGroup,
  FormLabel,
  LabelWithDescription,
  FieldDescription,
  FormInput,
  CalculateButton,
  ResultSection,
  ResultLabel,
  ResultValue,
  ResultUnit,
  ResultDetails,
  ResultDetailItem,
  DetailLabel,
  DetailValue,
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyText
} from './Detail.styles'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { calculateResult, getCalculatorTopicDetail } from '../../../../store/calculator/action'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from '../../../../components/common/Grid/Grid.styles'

const CalculatorDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id } = useParams()
    const { detail, loading } = useSelector(state => state.calculator)
    const [inputs, setInputs] = useState({})
    const [formErrors, setFormErrors] = useState({})

    // Calculation state
    const [result, setResult] = useState(null)

    useEffect(() => {
        dispatch(getCalculatorTopicDetail(id))
    }, [dispatch, id])

    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputs(prev => ({
          ...prev,
          [name]: value
        }))
    
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
          setFormErrors(prev => ({
            ...prev,
            [name]: ''
          }))
        }
      }
    
      const validateInputs = () => {
        const errors = {}
    
        if (!detail) return false
    
        detail.calculator_fields.forEach(field => {
          const value = inputs[field.key]
    
          if (field.is_required && (!value || value.trim() === '')) {
            errors[field.key] = `${field.label} is required`
          } else if (value && field.type === 'number') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) {
              errors[field.key] = `${field.label} must be a valid number`
            }
          }
        })
    
        setFormErrors(errors)
        return Object.keys(errors).length === 0
      }
    
      const handleCalculate = async (e) => {
        e.preventDefault()
    
        if (!validateInputs()) {
          return
        }

        const response = await dispatch(calculateResult(id, inputs))
        setResult(response)
      }
      if (!detail) {
        return 
      }

    return (
        <Container>
            <Content>
            <CalculatorForm>
                <FormHeader>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
                >
                    ← Back
                </Button>
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                    <FormTitle>{detail.title}</FormTitle>
                    {detail.description && (
                    <FormDescription>{detail.description}</FormDescription>
                    )}
                </div>
                </FormHeader>
    
                <form onSubmit={handleCalculate}>
                <InputsSection>
                    <Row>
                    {detail.calculator_fields?.map(field => (
                        <Col xs={12} md={6} key={field.key}>
                        <FormGroup>
                            <LabelWithDescription>
                            <FormLabel>
                                {field.label}
                                {field.unit && <span style={{ color: '#999', fontWeight: '400' }}> ({field.unit})</span>}
                                {field.is_required && <span style={{ color: '#ff6b6b' }}> *</span>}
                            </FormLabel>
                            {field.description && (
                                <FieldDescription>{field.description}</FieldDescription>
                            )}
                            </LabelWithDescription>
    
                            {field.type === 'dropdown' ? (
                            <Dropdown
                                options={field.field_options?.map(opt => ({
                                value: opt.value,
                                label: opt.label
                                })) || []}
                                value={inputs[field.key] ? {
                                value: inputs[field.key],
                                label: field.field_options?.find(opt => opt.value === inputs[field.key])?.label || inputs[field.key]
                                } : null}
                                onChange={(option) => handleInputChange({
                                target: { name: field.key, value: option?.value || '' }
                                })}
                                placeholder={field.placeholder || `Select ${field.label}`}
                            //   usePortal={true}
                            />
                            ) : field.type === 'radio' ? (
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {field.field_options && field.field_options.map(option => (
                                <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                    type="radio"
                                    name={field.key}
                                    value={option.value}
                                    checked={inputs[field.key] === option.value}
                                    onChange={handleInputChange}
                                    style={{ cursor: 'pointer' }}
                                    />
                                    <span>{option.label}</span>
                                </label>
                                ))}
                            </div>
                            ) : field.type === 'number' ? (
                            <TextInput
                                type="number"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                step="any"
                            />
                            ) : (
                            <TextInput
                                type="text"
                                name={field.key}
                                value={inputs[field.key] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            />
                            )}
    
                            {formErrors[field.key] && (
                            <ErrorMessage>
                                {formErrors[field.key]}
                            </ErrorMessage>
                            )}
                        </FormGroup>
                        </Col>
                    ))}
                    </Row>
                </InputsSection>
    
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading.isCalculateLoading}
                    style={{
                    width: '100%',
                    marginTop: '2rem',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 600
                    }}
                >
                    {loading.isCalculateLoading ? 'Calculating...' : 'Calculate Result'}
                </Button>
                </form>
    
                {result && (
                <div style={{
                    marginTop: '2rem',
                    padding: '2rem',
                    background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}>
                    {/* Result Value */}
                    <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(107, 185, 232, 0.08), rgba(141, 198, 63, 0.08))',
                    borderRadius: '8px',
                    border: '1px solid rgba(107, 185, 232, 0.2)',
                    marginBottom: '1.5rem'
                    }}>
                    <div style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        {result.result_label}
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.5rem'
                    }}>
                        <span>
                        {typeof result.result === 'number'
                            ? result.result.toFixed(2)
                            : result.result}
                        </span>
                        {result.result_unit && (
                        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6BB9E8' }}>
                            {result.result_unit}
                        </span>
                        )}
                    </div>
                    </div>
    
                    {/* Classifications */}
                    {result.classifications && result.classifications.length > 0 && (
                    <div style={{
                        marginBottom: '1.5rem',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#334155',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                        }}>
                        Interpretasi Hasil
                        </div>
                        {result.classifications.map((classification, index) => (
                        <div key={index} style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            borderLeft: '3px solid #6BB9E8'
                        }}>
                            <div style={{
                            fontSize: '0.813rem',
                            color: '#475569',
                            fontWeight: '600',
                            marginBottom: '0.375rem'
                            }}>
                            {classification.name}
                            </div>
                            {classification.matched_options && classification.matched_options.length > 0 ? (
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#1e293b',
                                fontWeight: '500'
                            }}>
                                {classification.matched_options.join(' • ')}
                            </div>
                            ) : (
                            <div style={{
                                fontSize: '0.813rem',
                                color: '#94a3b8',
                                fontStyle: 'italic'
                            }}>
                                Tidak ada klasifikasi
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                    )}
    
                    {/* Clinical References */}
                    {detail.clinical_references && detail.clinical_references.length > 0 && (
                    <div>
                        <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#334155',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                        }}>
                        Referensi Klinis
                        </div>
                        <div style={{
                        padding: '1rem',
                        background: '#fefce8',
                        borderRadius: '6px',
                        border: '1px solid #fde047'
                        }}>
                        <div style={{
                            fontSize: '0.813rem',
                            color: '#713f12',
                            lineHeight: '1.7'
                        }}>
                            {detail.clinical_references.map((reference, index) => (
                            <div key={index} style={{ marginBottom: index < detail.clinical_references.length - 1 ? '0.5rem' : 0 }}>
                                <span style={{ fontWeight: '600' }}>{index + 1}.</span> {reference}
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                )}
            </CalculatorForm>
            </Content>
        </Container>
    )
}

export default CalculatorDetail