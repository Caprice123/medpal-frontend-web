import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActiveCreditPlans, purchaseCredits } from '@store/credit/action'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  PlansGrid,
  PlanCard,
  PopularBadge,
  IconWrapper,
  PlanName,
  StatsContainer,
  PlanCredits,
  CreditsLabel,
  PriceContainer,
  PlanPrice,
  PricePerCredit,
  DiscountInfo,
  OriginalPrice,
  DiscountBadge,
  PurchaseButton,
  LoadingState,
  EmptyState,
  ErrorMessage,
  InfoSection,
  InfoTitle,
  StepsList
} from './CreditPurchase.styles'

function CreditPurchase({ isOpen, onClose, onPurchaseSuccess }) {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.credit.plans)
  const loading = useSelector(state => state.credit.loading.isPlansLoading)
  const error = useSelector(state => state.credit.error)
  const purchasing = useSelector(state => state.credit.loading.isPurchaseLoading)

  useEffect(() => {
    if (isOpen && plans.length === 0) {
      dispatch(fetchActiveCreditPlans())
    }
  }, [isOpen, dispatch, plans.length])

  const handlePurchase = async (plan) => {
    try {
      await new Promise((resolve, reject) => {
        dispatch(purchaseCredits(
          plan.id,
          'xendit',
          (data) => {
            const { paymentInfo } = data

            // If Xendit invoice URL is available, redirect to it
            if (paymentInfo.invoiceUrl) {
              // Open payment page in new window
              window.open(paymentInfo.invoiceUrl, '_blank')

              alert(
                `Payment page opened in new window!\n\n` +
                `Plan: ${plan.name}\n` +
                `Credits: ${plan.credits}\n` +
                `Amount: ${formatPrice(paymentInfo.amount)}\n\n` +
                `Please complete the payment. Your credits will be added automatically after payment confirmation.\n\n` +
                `If the payment window didn't open, click OK to open it.`
              )

              // Fallback: if user clicks OK, open again
              window.open(paymentInfo.invoiceUrl, '_blank')
            } else {
              // Manual payment fallback
              alert(
                `Purchase initiated!\n\n` +
                `Plan: ${plan.name}\n` +
                `Credits: ${plan.credits}\n` +
                `Amount: ${formatPrice(paymentInfo.amount)}\n\n` +
                `Payment Reference: ${paymentInfo.reference}\n\n` +
                `Please complete the manual payment and wait for admin approval.`
              )
            }

            if (onPurchaseSuccess) {
              onPurchaseSuccess(data)
            }

            resolve(data)
          },
          (err) => {
            alert('Purchase failed: ' + (err.response?.data?.message || err.message))
            reject(err)
          }
        ))
      })

      onClose()
    } catch (err) {
      // Error already handled in callback
      console.error('Purchase error:', err)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100)
  }

  const planIcons = {
    'basic': '📋',
    'starter': '🚀',
    'standard': '⭐',
    'premium': '💎',
    'professional': '👑',
    'enterprise': '🏆'
  }

  const getPlanIcon = (planName) => {
    const planNameLower = planName.toLowerCase()
    for (const [key, icon] of Object.entries(planIcons)) {
      if (planNameLower.includes(key)) {
        return icon
      }
    }
    return '💳'
  }

  if (!isOpen) return null

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Isi Ulang Kredit</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InfoSection>
            <InfoTitle>
              <span>ℹ️</span>
              Cara Membeli Kredit
            </InfoTitle>
            <StepsList>
              <li>Pilih paket kredit yang sesuai dengan kebutuhan Anda</li>
              <li>Klik tombol "Beli Sekarang" untuk memulai transaksi</li>
              <li>Anda akan menerima referensi pembayaran</li>
              <li>Lakukan pembayaran sesuai instruksi yang diberikan</li>
              <li>Admin akan memverifikasi pembayaran Anda</li>
              <li>Kredit akan otomatis ditambahkan setelah disetujui</li>
            </StepsList>
          </InfoSection>

          {loading ? (
            <LoadingState>Memuat paket kredit...</LoadingState>
          ) : plans.length > 0 ? (
            <PlansGrid>
              {plans.map((plan) => {
                const isPopular = plan.isPopular
                const hasDiscount = plan.discount > 0
                const finalPrice = hasDiscount
                  ? calculateDiscountedPrice(plan.price, plan.discount)
                  : plan.price
                const pricePerCredit = (finalPrice / plan.credits).toFixed(0)

                return (
                  <PlanCard key={plan.id} isPopular={isPopular}>
                    {isPopular && <PopularBadge>POPULER</PopularBadge>}

                    <IconWrapper>{getPlanIcon(plan.name)}</IconWrapper>
                    <PlanName>{plan.name}</PlanName>

                    <StatsContainer>
                      <PlanCredits>{plan.credits.toLocaleString()}</PlanCredits>
                      <CreditsLabel>Kredit</CreditsLabel>

                      {hasDiscount && (
                        <DiscountInfo>
                          <OriginalPrice>
                            {formatPrice(plan.price)}
                          </OriginalPrice>
                          <DiscountBadge>
                            HEMAT {plan.discount}%
                          </DiscountBadge>
                        </DiscountInfo>
                      )}

                      <PriceContainer>
                        <PlanPrice>
                          {formatPrice(finalPrice)}
                        </PlanPrice>
                        <PricePerCredit>
                          {formatPrice(pricePerCredit)}/kredit
                        </PricePerCredit>
                      </PriceContainer>
                    </StatsContainer>

                    <PurchaseButton
                      onClick={() => handlePurchase(plan)}
                      disabled={purchasing === plan.id}
                    >
                      {purchasing === plan.id ? 'Memproses...' : 'Beli Sekarang'}
                    </PurchaseButton>
                  </PlanCard>
                )
              })}
            </PlansGrid>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <div>Tidak ada paket kredit tersedia</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Silakan coba lagi nanti
              </div>
            </EmptyState>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreditPurchase
