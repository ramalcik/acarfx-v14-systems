let _sys = require('./Global/Settings/_system.json');
let botcuk = [
  {
    name: "Mainframe",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Voucher"
  },
  {
    name: "Controller",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Controller"
  },
  {
    name: "Statistics",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Statistics"
  },
  {
    name: "Sync",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Sync"
  },
  {
    name: "Security_I",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Guard_I"
  },
  {
    name: "Security_II",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Guard_II"
  },
  {
    name: "Distributors",
    namespace: "panter",
    script: 'main.panter',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Distributors"
  },
  
]

   

module.exports = {
  apps: botcuk
};