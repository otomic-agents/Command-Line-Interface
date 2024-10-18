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
    node bin/dev.js monkey -i 1200-1200 -r https://5b4522f4.vaughnmedellins394.myterminus.com -a 1000-1000 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed,refund" -C true -n testnet -T 0x8fCE65728e1e85487501F97adE2FA258F263b828 -S 0x7c295992662749747cd520b993a9c4dfb731b07241e28163477b293bbf9e217f -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "501-0xd691ced994b9c641cf8f80b5f4dbdd80f0fd86af1b8604a702151fa7e46b7232--->9006-0xacda8bf66c2cadac9e99aa1aa75743f536e71094,9006-0xacda8bf66c2cadac9e99aa1aa75743f536e71094--->501-0xd691ced994b9c641cf8f80b5f4dbdd80f0fd86af1b8604a702151fa7e46b7232" -c "{\"opt\": \"https://sepolia.optimism.io\"}" -l "vaughnmedellins394.myterminus.com" -d true >> "$log_file" 2>&1
    
    exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "monkey exited with code $exit_code at $(date)" >> "$log_file"
        exit 1
    fi
    
    sleep 1

done