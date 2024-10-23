#!/bin/bash

# Load environment variables
set -a
source .env
set +a

log_directory="./logs/multi_monkey"

if [ ! -d "$log_directory" ]; then
    mkdir -p "$log_directory"
    echo "Created log directory: $log_directory"
fi

# Function to run a single monkey
run_monkey() {
    local evm_private_key=$1
    local evm_public_key=$2
    local solana_private_key=$3
    local solana_public_key=$4
    local log_file=$5

    echo "Starting monkey application..." >> "$log_file"
    node bin/dev.js monkey -i 1200-1200 -r https://5b4522f4.nathanielight.myterminus.com -a 1000-1000 -p $evm_private_key -s $solana_private_key -t "succeed,refund" -C true -n mainnet -T $evm_public_key -S $solana_public_key -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "9006-0x55d398326f99059fF775485246999027B3197955--->501-0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61,501-0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61--->9006-0x55d398326f99059fF775485246999027B3197955" -c "{\"polygon\": \"https://polygon-rpc.com\"}" -l "maximilianus.myterminus.com" -d true >> "$log_file" 2>&1
}

# Function to check if current time is within the allowed window
is_allowed_time() {
    local current_hour=$(date +%H)
    local current_minute=$(date +%M)
    local current_time=$((current_hour * 60 + current_minute))
    local start_time=$((10 * 60))  # 10:00 AM
    local end_time=$((11 * 60))    # 11:00 AM

    if [ $current_time -ge $start_time ] && [ $current_time -lt $end_time ]; then
        return 0  # True, it's within the allowed time
    else
        return 1  # False, it's outside the allowed time
    fi
}

while true; do
    if is_allowed_time; then
        echo "It's within the allowed time window. Starting monkeys..."
        
        current_datetime=$(date +"%Y-%m-%d_%H%M%S")
        
        # Array to store background process IDs
        pids=()

        # Counter for monkey instances
        counter=1

        # Run monkeys in parallel
        while true; do
            evm_private_key_var="EVM_PRIVATE_KEY_$counter"
            evm_public_key_var="EVM_PUBLIC_KEY_$counter"
            solana_private_key_var="SOLANA_PRIVATE_KEY_$counter"
            solana_public_key_var="SOLANA_PUBLIC_KEY_$counter"

            # Check if variables exist
            if [ -z "${!evm_private_key_var}" ] || [ -z "${!evm_public_key_var}" ] || 
               [ -z "${!solana_private_key_var}" ] || [ -z "${!solana_public_key_var}" ]; then
                break
            fi

            log_file="${log_directory}/${current_datetime}_monkey_${counter}.log"
            
            run_monkey "${!evm_private_key_var}" "${!evm_public_key_var}" "${!solana_private_key_var}" "${!solana_public_key_var}" "$log_file" &
            
            pids+=($!)
            ((counter++))
        done

        # Wait for all monkeys to finish
        for pid in "${pids[@]}"; do
            wait $pid
            exit_code=$?
            if [ $exit_code -ne 0 ]; then
                echo "A monkey exited with code $exit_code at $(date)" >> "${log_directory}/error.log"
                exit 1
            fi
        done

        echo "All monkeys finished. Waiting for next allowed time window..."
    else
        echo "Outside of allowed time window. Waiting..."
    fi

    # Sleep for 1 minute before checking time again
    sleep 60
done