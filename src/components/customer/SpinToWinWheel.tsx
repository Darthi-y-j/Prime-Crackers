import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Gift, LogIn, Sparkles, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'
import {
  SPIN_REWARDS,
  SPIN_ANIMATION_MS,
  describeWheelSegmentPath,
  getNextSpinRotation,
  getSegmentArcAngles,
  getSpinRewardMessage,
  pickSpinRewardForCartTotal,
  polarFromTop,
  type SpinReward,
} from '@/lib/spinToWin'

interface SpinToWinWheelProps {
  estimatedTotal: number
  reward: SpinReward | null
  onRewardChange?: (reward: SpinReward | null, discount: number) => void
  className?: string
}

const SPIN_EASING = 'cubic-bezier(0.2, 0.9, 0.2, 1)'

const WHEEL_SIZE = 288
const WHEEL_CENTER = WHEEL_SIZE / 2
const WHEEL_RADIUS = WHEEL_CENTER - 4
const LABEL_RADIUS = WHEEL_RADIUS * 0.62

function WheelSegments() {
  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      {SPIN_REWARDS.map((segment) => {
        const { center } = getSegmentArcAngles(segment.segmentIndex)
        const labelPos = polarFromTop(WHEEL_CENTER, WHEEL_CENTER, LABEL_RADIUS, center)

        return (
          <g key={segment.id}>
            <path
              d={describeWheelSegmentPath(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, segment.segmentIndex)}
              fill={segment.color}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.5}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill={segment.textColor}
              fontSize={segment.label.length > 12 ? 7.5 : 8.5}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${center}, ${labelPos.x}, ${labelPos.y})`}
              style={{ letterSpacing: '0.04em' }}
            >
              {segment.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function SpinToWinWheel({
  estimatedTotal,
  reward,
  onRewardChange,
  className,
}: SpinToWinWheelProps) {
  const { user, isCustomer, loading } = useAuth()
  const { showToast } = useToast()
  const [spinning, setSpinning] = useState(false)
  const rotationRef = useRef(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const pendingRewardRef = useRef<SpinReward | null>(null)
  const spinFinishTimerRef = useRef<number | null>(null)

  const applyWheelRotation = (degrees: number, animate: boolean) => {
    const wheel = wheelRef.current
    if (!wheel) return

    wheel.style.transition = animate
      ? `transform ${SPIN_ANIMATION_MS}ms ${SPIN_EASING}`
      : 'none'
    wheel.style.transform = `rotate(${degrees}deg)`
    rotationRef.current = degrees
  }

  useLayoutEffect(() => {
    applyWheelRotation(rotationRef.current, false)
  }, [])

  useEffect(() => {
    return () => {
      if (spinFinishTimerRef.current != null) {
        window.clearTimeout(spinFinishTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (reward) return

    pendingRewardRef.current = null
    rotationRef.current = 0
    applyWheelRotation(0, false)
  }, [reward])

  const finishSpin = (won: SpinReward) => {
    pendingRewardRef.current = null
    onRewardChange?.(won, 0)
    setSpinning(false)
    showToast(getSpinRewardMessage(won), 'success')
  }

  const handleSpin = () => {
    if (!user?.id || !isCustomer || spinning || reward) return

    const pickedReward = pickSpinRewardForCartTotal(estimatedTotal)
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const landingRotation = getNextSpinRotation(
      rotationRef.current,
      pickedReward.segmentIndex,
      extraSpins,
    )

    pendingRewardRef.current = pickedReward
    setSpinning(true)

    const wheel = wheelRef.current
    if (!wheel) return

    wheel.style.transition = 'none'
    wheel.style.transform = `rotate(${rotationRef.current}deg)`
    void wheel.offsetHeight

    wheel.style.transition = `transform ${SPIN_ANIMATION_MS}ms ${SPIN_EASING}`
    wheel.style.transform = `rotate(${landingRotation}deg)`
    rotationRef.current = landingRotation

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== wheel || event.propertyName !== 'transform') return
      wheel.removeEventListener('transitionend', onTransitionEnd)
      if (spinFinishTimerRef.current != null) {
        window.clearTimeout(spinFinishTimerRef.current)
        spinFinishTimerRef.current = null
      }
      const won = pendingRewardRef.current
      if (won) finishSpin(won)
    }

    wheel.addEventListener('transitionend', onTransitionEnd)

    if (spinFinishTimerRef.current != null) {
      window.clearTimeout(spinFinishTimerRef.current)
    }
    spinFinishTimerRef.current = window.setTimeout(() => {
      wheel.removeEventListener('transitionend', onTransitionEnd)
      const won = pendingRewardRef.current
      if (won) finishSpin(won)
    }, SPIN_ANIMATION_MS + 150)
  }

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-gold-400/25 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-6',
          className,
        )}
      >
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!user || !isCustomer) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-6 shadow-[0_20px_60px_rgba(245,158,11,0.12)]',
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.18),transparent_65%)]"
          aria-hidden="true"
        />
        <div className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-500/10">
            <Gift className="h-7 w-7 text-gold-400" />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-gold-400">Premium</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Spin to Win</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-100/70">
            Log in to spin the wheel and win a free gift with your order before you send your WhatsApp enquiry.
          </p>
          <Link
            to="/login"
            state={{ from: '/cart' }}
            className="btn-hover-lift mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-festive-500/30"
          >
            <LogIn className="h-4 w-4" />
            Login to Spin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-5 shadow-[0_20px_60px_rgba(245,158,11,0.12)] sm:p-6',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.16),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="w-full shrink-0 text-center lg:max-w-[220px] lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-500/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-300">Premium</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-[1.75rem]">Spin to Win</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream-100/70">
            One spin per enquiry. Win a free gift for this order — included with your WhatsApp message.
          </p>
          {reward && (
            <div className="mt-4 rounded-2xl border border-gold-400/25 bg-white/5 px-4 py-3 text-left">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
                <Trophy className="h-3.5 w-3.5" />
                Your gift
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">{reward.label}</p>
              <p className="mt-1 text-xs text-cream-100/65">{getSpinRewardMessage(reward)}</p>
            </div>
          )}
        </div>

        <div className="relative mx-auto flex h-[min(72vw,17rem)] w-[min(72vw,17rem)] items-center justify-center sm:h-72 sm:w-72">
          <div
            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
            aria-hidden="true"
          >
            <div className="h-0 w-0 border-x-[12px] border-x-transparent border-b-[22px] border-b-gold-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] sm:border-x-[14px] sm:border-b-[26px]" />
          </div>

          <div className="absolute inset-0 rounded-full border-[6px] border-gold-400/80 shadow-[0_0_0_4px_rgba(15,13,11,0.45),0_0_40px_rgba(245,158,11,0.25)]" />

          <div
            ref={wheelRef}
            className={cn(
              'relative h-full w-full origin-center rounded-full',
              spinning && 'pointer-events-none',
            )}
          >
            <WheelSegments />
          </div>

          <div className="pointer-events-none absolute inset-[28%] flex items-center justify-center overflow-hidden rounded-full border border-gold-300/40 bg-gradient-to-br from-navy-950 to-[#2a1a08] shadow-inner">
            <img
              src={SITE_LOGO_PATH}
              alt=""
              className="h-[70%] w-[70%] scale-125 object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || Boolean(reward)}
            className={cn(
              'absolute z-30 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-300/60 bg-gradient-to-br from-festive-500 via-gold-400 to-festive-500 text-center text-[11px] font-black uppercase leading-tight tracking-wide text-navy-950 shadow-[0_8px_24px_rgba(245,158,11,0.45)] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:h-24 sm:w-24 sm:text-xs',
            )}
          >
            {spinning ? 'Spinning…' : reward ? 'Done' : 'Spin'}
          </button>
        </div>
      </div>
    </div>
  )
}
