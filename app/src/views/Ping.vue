<template>
  <div>health-check: ok</div>
</template>

<script>
export default {
  layout: 'PingLayout',
  asyncData({ app, req, redirect }) {
    const targetAgents = app.$env.HEALTH_CHECK_AGENT_STRING || ''

    if (process.client || typeof targetAgents !== 'string') {
      redirect('/')
      return
    }

    // server-side only
    const userAgent = req.headers['user-agent'] || ''

    const isHealthCheck = targetAgents
      .split(',')
      .find((agent) => userAgent.includes(agent.trim()))

    if (typeof isHealthCheck === 'undefined') {
      redirect('/')
    }
  },
}
</script>
