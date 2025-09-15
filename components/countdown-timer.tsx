import Countdown from 'react-countdown'

export default function CountdownTimer(props: { timeLeft: number }) {
  const CountdownCompletion = () => <p>Auction has completed!</p>

  const countdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed
  }: {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    if (completed) {
      return <CountdownCompletion />
    } else {
      return (
        <div className='grid grid-flow-col gap-4 text-center auto-cols-max'>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': hours } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {hours}
              </span>
            </span>
            hours
          </div>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': minutes } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {minutes}
              </span>
            </span>
            min
          </div>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': seconds } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {seconds}
              </span>
            </span>
            sec
          </div>
        </div>
      )
    }
  }

  return (
    <Countdown
      date={Date.now() + props.timeLeft * 1000}
      renderer={countdownRenderer}
    />
  )
}
