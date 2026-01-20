import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  ${props => props.fluid ? `
    max-width: 100%;
  ` : `
    @media (min-width: 576px) {
      max-width: 540px;
    }
    @media (min-width: 768px) {
      max-width: 720px;
    }
    @media (min-width: 992px) {
      max-width: 960px;
    }
    @media (min-width: 1200px) {
      max-width: 1140px;
    }
    @media (min-width: 1400px) {
      max-width: 1320px;
    }
  `}
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;

  ${props => props.noGutters && `
    margin-right: 0;
    margin-left: 0;

    > * {
      padding-right: 0;
      padding-left: 0;
    }
  `}

  ${props => props.gap && `
    gap: ${props.gap};
    margin-right: 0;
    margin-left: 0;

    > * {
      padding-right: 0;
      padding-left: 0;
    }
  `}

  ${props => props.alignItems && `
    align-items: ${props.alignItems};
  `}

  ${props => props.justifyContent && `
    justify-content: ${props.justifyContent};
  `}
`

const getColWidth = (size) => {
  if (!size) return 'flex: 1 0 0%;'
  if (size === 'auto') return 'flex: 0 0 auto; width: auto;'
  const percentage = (size / 12) * 100
  return `flex: 0 0 ${percentage}%; max-width: ${percentage}%;`
}

export const Col = styled.div`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;

  /* Default (xs) */
  ${props => getColWidth(props.xs || props.col)}

  /* Small devices (sm) */
  @media (min-width: 576px) {
    ${props => props.sm && getColWidth(props.sm)}
  }

  /* Medium devices (md) */
  @media (min-width: 768px) {
    ${props => props.md && getColWidth(props.md)}
  }

  /* Large devices (lg) */
  @media (min-width: 992px) {
    ${props => props.lg && getColWidth(props.lg)}
  }

  /* Extra large devices (xl) */
  @media (min-width: 1200px) {
    ${props => props.xl && getColWidth(props.xl)}
  }

  /* Extra extra large devices (xxl) */
  @media (min-width: 1400px) {
    ${props => props.xxl && getColWidth(props.xxl)}
  }

  ${props => props.offset && `
    margin-left: ${(props.offset / 12) * 100}%;
  `}

  ${props => props.order && `
    order: ${props.order};
  `}

  ${props => props.alignSelf && `
    align-self: ${props.alignSelf};
  `}
`
