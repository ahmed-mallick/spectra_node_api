module.exports = {
  apps: [
    {
      name: "SpectraNodeAPI",
      script: "./server.js",

      /* === CLUSTER MODE === */
      exec_mode: "cluster",
      instances: "3", // uses all CPU cores

      /* === NODE PERFORMANCE === */
      node_args: [
        "--max-old-space-size=4096", // adjust per server RAM
        "--optimize-for-size"
      ],

      /* === ENVIRONMENTS === */
      env: {
        NODE_ENV: "production"
      },

      /* === STABILITY / RECOVERY === */
      autorestart: true,
      watch: false,

      /* Restart if memory exceeds limit */
      max_memory_restart: "3G",

      /* Prevent crash loops */
      restart_delay: 5000,
      min_uptime: "60s",
      max_restarts: 10,

      /* === GRACEFUL SHUTDOWN === */
      kill_timeout: 30000,
      listen_timeout: 10000,

      /* === ZERO-DOWNTIME RELOAD === */
      wait_ready: false,

      /* === LOGGING === */
      out_file: "./logs/app-out.log",
      error_file: "./logs/app-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      /* === BACKOFF STRATEGY === */
      exp_backoff_restart_delay: 1000,

      /* === PERFORMANCE OPTIMIZATION === */
      disable_logs: false,

      /* === HEALTH === */
      time: true
    }
  ]
};