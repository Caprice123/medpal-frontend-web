import { useState } from 'react'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import CurrencyInput from '@components/common/CurrencyInput'
import Textarea from '@components/common/Textarea'
import Table from '@components/common/Table'
import {
  Container,
  Header,
  Title,
  Subtitle,
  Section,
  SectionTitle,
  ComponentGrid,
  ComponentCard,
  ComponentLabel,
  ComponentDemo,
  StateLabel,
  ButtonGroup,
  Badge,
  ColorPalette,
  ColorSwatch
} from './UITest.styles'

function UITest() {
  const [selectedDropdown, setSelectedDropdown] = useState(null)
  const [selectedMulti, setSelectedMulti] = useState({ value: 'option1', label: 'Option 1' })

  // Form input states
  const [textValue, setTextValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [currencyValue, setCurrencyValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  // Table data
  const tableColumns = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', align: 'center' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'error'}>
          {value}
        </Badge>
      )
    }
  ]

  const tableData = [
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Siti Permata', email: 'siti@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Budi Wijaya', email: 'budi@example.com', role: 'User', status: 'inactive' },
    { id: 4, name: 'Dewi Sartika', email: 'dewi@example.com', role: 'Editor', status: 'active' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko@example.com', role: 'User', status: 'active' }
  ]

  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' }
  ]

  return (
    <Container>
      <Header>
        <Title>UI Component Testing</Title>
        <Subtitle>Test and preview all UI components in different states</Subtitle>
      </Header>

      {/* Dropdowns Section */}
      <Section>
        <SectionTitle>Dropdowns</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Normal State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Default</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={selectedDropdown}
                onChange={setSelectedDropdown}
                placeholder="Select an option"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>With Value</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Selected value</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={selectedMulti}
                onChange={setSelectedMulti}
                placeholder="Select an option"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Error State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Has error</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={null}
                onChange={() => {}}
                placeholder="Select an option"
                hasError={true}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Disabled State</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <Dropdown
                options={dropdownOptions}
                value={{ value: 'option1', label: 'Option 1' }}
                onChange={() => {}}
                placeholder="Select an option"
                disabled={true}
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Button Variants</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Primary</StateLabel>
              <ButtonGroup>
                <Button variant="primary">Primary</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Secondary</StateLabel>
              <ButtonGroup>
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Danger</StateLabel>
              <ButtonGroup>
                <Button variant="danger">Danger</Button>
                <Button variant="danger" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Success</StateLabel>
              <ButtonGroup>
                <Button variant="success">Success</Button>
                <Button variant="success" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Outline</StateLabel>
              <ButtonGroup>
                <Button variant="outline">Outline</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </ButtonGroup>
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Button Sizes</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Sizes</StateLabel>
              <ButtonGroup>
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="medium">Medium</Button>
                <Button variant="primary" size="large">Large</Button>
              </ButtonGroup>
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Full Width</StateLabel>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Form Inputs Section */}
      <Section>
        <SectionTitle>Form Inputs</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Text Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal with Label</StateLabel>
              <TextInput
                label="Full Name"
                placeholder="Enter your name..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Required</StateLabel>
              <TextInput
                label="Email Address"
                required
                type="email"
                placeholder="Enter your email..."
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                hint="We'll never share your email"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <TextInput
                label="Username"
                placeholder="Enter username..."
                error="Username is already taken"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <TextInput
                label="Disabled Field"
                placeholder="Cannot edit..."
                disabled
                value="Disabled value"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Password Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Password Field</StateLabel>
              <TextInput
                label="Password"
                required
                type="password"
                placeholder="Enter password..."
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                hint="Minimum 8 characters"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Currency Input</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal</StateLabel>
              <CurrencyInput
                label="Price"
                placeholder="0"
                value={currencyValue}
                onChange={(e) => setCurrencyValue(e.target.value)}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Required with Hint</StateLabel>
              <CurrencyInput
                label="Amount"
                required
                placeholder="0"
                hint="Enter amount in Indonesian Rupiah"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <CurrencyInput
                label="Budget"
                placeholder="0"
                error="Amount must be greater than 0"
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <CurrencyInput
                label="Total"
                placeholder="0"
                disabled
                value="100000"
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Textarea</ComponentLabel>
            <ComponentDemo>
              <StateLabel>Normal</StateLabel>
              <Textarea
                label="Description"
                placeholder="Enter description..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={3}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>With Character Count</StateLabel>
              <Textarea
                label="Bio"
                required
                placeholder="Tell us about yourself..."
                maxLength={200}
                showCharCount
                hint="Maximum 200 characters"
                rows={4}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Error State</StateLabel>
              <Textarea
                label="Comments"
                placeholder="Enter comments..."
                error="This field is required"
                rows={3}
              />
            </ComponentDemo>
            <ComponentDemo>
              <StateLabel>Disabled</StateLabel>
              <Textarea
                label="Notes"
                placeholder="Cannot edit..."
                disabled
                value="This textarea is disabled"
                rows={3}
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Table Section */}
      <Section>
        <SectionTitle>Tables</SectionTitle>
        <ComponentGrid>
          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Normal Table</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={tableData}
                hoverable
                onRowClick={(row) => console.log('Clicked row:', row)}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard style={{ gridColumn: '1 / -1' }}>
            <ComponentLabel>Striped Table</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={tableData}
                striped
                hoverable={false}
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Loading State</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={[]}
                loading
              />
            </ComponentDemo>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Empty State</ComponentLabel>
            <ComponentDemo>
              <Table
                columns={tableColumns}
                data={[]}
                emptyText="No users found"
                emptySubtext="Try adding some users to get started"
              />
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Badges Section */}
      <Section>
        <SectionTitle>Badges</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Badge Variants</ComponentLabel>
            <ComponentDemo>
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
            </ComponentDemo>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Color Palette Section */}
      <Section>
        <SectionTitle>Color Palette</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Primary Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#6BB9E8">
                <div>Primary</div>
                <div>#6BB9E8</div>
              </ColorSwatch>
              <ColorSwatch color="#4A9ED4">
                <div>Primary Dark</div>
                <div>#4A9ED4</div>
              </ColorSwatch>
              <ColorSwatch color="#8ECDF0" light>
                <div>Primary Light</div>
                <div>#8ECDF0</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Secondary & Accent</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#8DC63F">
                <div>Success/Green</div>
                <div>#8DC63F</div>
              </ColorSwatch>
              <ColorSwatch color="#6BA32E">
                <div>Green Dark</div>
                <div>#6BA32E</div>
              </ColorSwatch>
              <ColorSwatch color="#A8D86A" light>
                <div>Green Light</div>
                <div>#A8D86A</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Status Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#ef4444">
                <div>Error</div>
                <div>#ef4444</div>
              </ColorSwatch>
              <ColorSwatch color="#f59e0b">
                <div>Warning</div>
                <div>#f59e0b</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Neutral Colors</ComponentLabel>
            <ColorPalette>
              <ColorSwatch color="#111827">
                <div>Gray 900</div>
                <div>#111827</div>
              </ColorSwatch>
              <ColorSwatch color="#374151">
                <div>Gray 700</div>
                <div>#374151</div>
              </ColorSwatch>
              <ColorSwatch color="#6b7280">
                <div>Gray 500</div>
                <div>#6b7280</div>
              </ColorSwatch>
              <ColorSwatch color="#9ca3af">
                <div>Gray 400</div>
                <div>#9ca3af</div>
              </ColorSwatch>
              <ColorSwatch color="#d1d5db" light>
                <div>Gray 300</div>
                <div>#d1d5db</div>
              </ColorSwatch>
              <ColorSwatch color="#e5e7eb" light>
                <div>Gray 200</div>
                <div>#e5e7eb</div>
              </ColorSwatch>
              <ColorSwatch color="#f9fafb" light>
                <div>Gray 50</div>
                <div>#f9fafb</div>
              </ColorSwatch>
            </ColorPalette>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Typography Section */}
      <Section>
        <SectionTitle>Typography</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentLabel>Headings</ComponentLabel>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Heading 1
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              Heading 2
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Heading 3
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Heading 4
            </div>
          </ComponentCard>

          <ComponentCard>
            <ComponentLabel>Body Text</ComponentLabel>
            <div style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>
              Body Large (1rem / 16px)
            </div>
            <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
              Body Normal (0.875rem / 14px)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Body Small (0.75rem / 12px)
            </div>
            <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
              Caption (0.625rem / 10px)
            </div>
          </ComponentCard>
        </ComponentGrid>
      </Section>
    </Container>
  )
}

export default UITest
