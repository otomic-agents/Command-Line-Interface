#!/bin/bash

log_directory="./logs/mainnet"

if [ ! -d "$log_directory" ]; then
mkdir -p "$log_directory"
echo "Created log directory: $log_directory"
fi

while true; do

    current_datetime=$(date +"%Y-%m-%d_%H%M%S")
    log_file="${log_directory}/${current_datetime}.log"

    echo "Starting monkey_mainnet application..." >> "$log_file"
    node bin/dev.js monkey -i 1800-7200 -r https://5b4522f4.mariansopsoraj.myterminus.com -a 10-30 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed,refund,cheat amount,cheat address,cheat txin" -C true -n mainnet -T 0x28623BF8E872FFAE6e2955a176dFCd10B97a09b3 -S 0x5c48523b82474e6a95e2fd4afc64deb470d1239d997d38ea332227eef84107dd -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "" -c "{\"polygon\": \"https://polygon-rpc.com\"}" -l "ballgcolin@myterminus.com" -d true >> "$log_file" 2>&1
    
    echo "Monkey_mainnet application exited with code $?. Restarting..." >> "$log_file"
    
    sleep 1

done