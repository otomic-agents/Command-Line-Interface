#!/bin/bash

log_directory="./logs/testnet2"

if [ ! -d "$log_directory" ]; then
mkdir -p "$log_directory"
echo "Created log directory: $log_directory"
fi

while true; do

    current_datetime=$(date +"%Y-%m-%d_%H%M%S")
    log_file="${log_directory}/${current_datetime}.log"

    echo "Starting monkey_testnet application..." >> "$log_file"
    node bin/dev.js monkey -i 3600-3600 -r https://5b4522f4.vaughnmedellins394.myterminus.com -a 1000-1000 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed" -C true -n testnet -T 0x8fCE65728e1e85487501F97adE2FA258F263b828 -S 0x7c295992662749747cd520b993a9c4dfb731b07241e28163477b293bbf9e217f -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "9006-0xaCDA8BF66C2CADAc9e99Aa1aa75743F536E71094--->501-0xd691ced994b9c641cf8f80b5f4dbdd80f0fd86af1b8604a702151fa7e46b7232,501-0xd691ced994b9c641cf8f80b5f4dbdd80f0fd86af1b8604a702151fa7e46b7232--->9006-0xaCDA8BF66C2CADAc9e99Aa1aa75743F536E71094" -c "{\"opt\": \"https://sepolia.optimism.io\"}" -l "vaughnmedellins394.myterminus.com" -d true >> "$log_file" 2>&1
    
    echo "Monkey_testnet application exited with code $?. Restarting..." >> "$log_file"
    
    sleep 1

done