#!/bin/bash

log_directory="./logs/mainnet/long_run"

if [ ! -d "$log_directory" ]; then
    mkdir -p "$log_directory"
    echo "Created log directory: $log_directory"
fi

while true; do

    current_datetime=$(date +"%Y-%m-%d_%H%M%S")
    log_file="${log_directory}/${current_datetime}.log"

    echo "Starting monkey_mainnet application..." >> "$log_file"
    node bin/dev.js monkey -i 3600-7200 -r https://5b4522f4.nathanielight.myterminus.com -a 1000-1000 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed,refund,cheat amount,cheat address,cheat txin" -C true -n mainnet -T 0x28623BF8E872FFAE6e2955a176dFCd10B97a09b3 -S 0x5c48523b82474e6a95e2fd4afc64deb470d1239d997d38ea332227eef84107dd -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "9006-0x55d398326f99059fF775485246999027B3197955--->501-0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61,501-0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61--->9006-0x55d398326f99059fF775485246999027B3197955" -c "{\"polygon\": \"https://polygon-rpc.com\"}" -l "maximilianus.myterminus.com" -d true >> "$log_file" 2>&1
    
    exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "monkey exited with code $exit_code at $(date)" >> "$log_file"
        exit 1
    fi

    sleep 1
    
done