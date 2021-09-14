import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends Component {
  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      // window.scrollTo(0, 0);
      const layoutContentNode = document.querySelector('#mainContainer')
      // 重点在这里， 需要是在 产生 scroll 的父元素 上进行 scrollTo，而不能在window上，因为在项目中，window不是产生滑动的父元素
      layoutContentNode && layoutContentNode.scrollTo(0, 0)
    }
  }
  render () {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
