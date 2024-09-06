#!/bin/bash

log_directory="./logs/testnet"

if [ ! -d "$log_directory" ]; then
mkdir -p "$log_directory"
echo "Created log directory: $log_directory"
fi

while true; do

    current_datetime=$(date +"%Y-%m-%d_%H%M%S")
    log_file="${log_directory}/${current_datetime}.log"

    echo "Starting monkey_testnet application..." >> "$log_file"
    node bin/dev.js monkey -i 300-450 -r https://5b4522f4.vaughnmedellins394.myterminus.com -a 1000-1000 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed" -C true -n testnet -T 0x945e9704D2735b420363071bB935ACf2B9C4b814 -S 0xfee69ce6840ffcc48af425d5827e8dbcb1a9afd688ef206ee3da5c9ef23503dc -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "" -c "{\"opt\": \"https://sepolia.optimism.io\"}" -l "vaughnmedellins394.myterminus.com" -d true >> "$log_file" 2>&1
    
    echo "Monkey_testnet application exited with code $?. Restarting..." >> "$log_file"
    
    sleep 1

done