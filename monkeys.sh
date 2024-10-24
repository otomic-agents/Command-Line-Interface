#!/bin/bash

# Load environment variables
set -a
source ./env/monkeys.mainnet.env
set +a

log_directory="./logs/mainnet/multi_monkeys"

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
    node bin/dev.js monkey -i 600-600 -r https://xxxx -a 1000-1000 -p $evm_private_key -s $solana_private_key -t "succeed" -C true -n mainnet -T $evm_public_key -S $solana_public_key -w http://n8n.edge-dev.xyz/webhook/xxxxx -b "614-0x4200000000000000000000000000000000000042--->614-0x94b008aA00579c1307B0EF2c499aD98a8ce58e58,614-0x94b008aA00579c1307B0EF2c499aD98a8ce58e58--->614-0x4200000000000000000000000000000000000042" -c "{\"opt\": \"https://optimism-mainnet.infura.io/v3\"}" -l "maximilianus.myterminus.com" -d true >> "$log_file" 2>&1
}

# Function to check if current time is within the allowed window
is_allowed_time() {
    local current_hour=$(date +%H | sed 's/^0*//')
    local current_minute=$(date +%M | sed 's/^0*//')
    local current_time=$((current_hour * 60 + current_minute))
    local start_time=$((10 * 60 + 30))  # 10:30 AM UTC -> 6:30 PM CST
    local end_time=$((11 * 60))    # 11:00 AM UTC -> 7:00 PM CST

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
            
            echo "counter: $counter"
            pids+=($!)
            ((counter++))
            echo "pids: ${pids[@]}"
        done

        # Wait for all monkeys to finish
        while [ ${#pids[@]} -gt 0 ]; do
            for i in "${!pids[@]}"; do
                if ! kill -0 ${pids[i]} 2>/dev/null; then
                    wait ${pids[i]}
                    exit_code=$?
                    if [ $exit_code -ne 0 ]; then
                        echo "Monkey ${pids[i]} exited with code $exit_code at $(date)"
                    fi
                    unset 'pids[i]'
                fi
            done
            # Small sleep to prevent CPU thrashing
            sleep 1
        done
        echo "All monkeys finished. Waiting for next allowed time window..."
    else
        echo "Outside of allowed time window. Waiting..."
    fi

    # Sleep for 1 minute before checking time again
    sleep 60
done