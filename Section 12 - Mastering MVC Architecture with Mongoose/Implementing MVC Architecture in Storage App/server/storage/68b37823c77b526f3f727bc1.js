var cfg = rs.conf();
cfg.members[0].host = "54.211.110.36:27017"; // Replace with your public IP
rs.reconfig(cfg, { force: true });