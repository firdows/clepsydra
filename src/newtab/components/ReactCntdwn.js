// https://github.com/sungwoncho/react-cntdwn/blob/master/src/cntdwn.jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const COUNTDOWN_NOT_STARTED = 1
const COUNTDOWN_STARTED = 2
const COUNTDOWN_FINISHED = 3

export default class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remainingTime: 0,
      status: COUNTDOWN_NOT_STARTED,
      intervalId: null
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      let timer = setInterval(() => {
        this.tick()
      }, this.props.interval)

      this.setState({
        status: COUNTDOWN_STARTED,
        intervalId: timer
      })

      this.tick()
    }, this.props.startDelay)
  }

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId)
  }

  calculateRemainingTime = () => {
    return -1 * moment().diff(this.props.targetDate)
  }

  addLeadingZero = (value) => {
    if (value < 10) {
      return '0' + value.toString()
    }
    return value
  }

  tick = () => {
    this.setState({
      remainingTime: this.calculateRemainingTime()
    })

    if (this.state.remainingTime <= 0) {
      this.setState({
        status: COUNTDOWN_FINISHED
      })

      if (this.props.onFinished) {
        this.props.onFinished()
      }
      clearInterval(this.state.intervalId)
    }
  }

  renderRemainingTime = () => {
    const html = []
    const { format, leadingZero } = this.props
    const { remainingTime } = this.state
    const r = moment.duration(remainingTime)

    const withField = (name) => {
      if (format[name]) {
        const x = r.get(name)
        const x2 = leadingZero ? this.addLeadingZero(x) : x

        html.push(
          <span className={`react-cntdwn-${name}`} key={name}>
          {x2}&nbsp;
        </span>
        )
      }
    }

    withField('years')
    withField('months')
    withField('days')
    withField('hours')
    withField('minutes')
    withField('seconds')
    withField('milliseconds')

    return html
  }

  render = () => {
    if (this.state.status === COUNTDOWN_NOT_STARTED) {
      return (
        <span></span>
      )
    }
    return (
      <div className='react-cntdwn-timer'>
        {this.renderRemainingTime()}
      </div>
    )
  }
}

Countdown.propTypes = {
  targetDate: PropTypes.instanceOf(Date).isRequired,
  interval: PropTypes.number,
  startDelay: PropTypes.number,
  onFinished: PropTypes.func,
  format: PropTypes.object,
  leadingZero: PropTypes.bool
}

Countdown.defaultProps = {
  interval: 1000,
  startDelay: 0,
  format: {
    years: true,
    months: true,
    days: true,
    hours: 'HH',
    minutes: 'MM',
    seconds: 'SS'
  },
  leadingZero: false
}