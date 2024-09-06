#!/bin/bash

log_directory="./logs/mainnet"

if [ ! -d "$log_directory" ]; then
    mkdir -p "$log_directory"
    echo "Created log directory: $log_directory"
fi

# Function to get Unix timestamp for a given time
get_timestamp() {
  date -d "$1" +%s
}

# Set start and end times
break_start_time=$(get_timestamp "$current_date 7:00:00")  # 3:00 PM +8
break_end_time=$(get_timestamp "$current_date 8:00:00")    # 4:00 PM +8

while true; do

    current_time=$(date +%s)

    if [ $current_time -ge $break_start_time ] && [ $current_time -lt $break_end_time ]; then
        echo "break time"
        sleep 60  # Wait for 1 minute before the next iteration
    else
        current_datetime=$(date +"%Y-%m-%d_%H%M%S")
        log_file="${log_directory}/${current_datetime}.log"

        echo "Starting monkey_mainnet application..." >> "$log_file"
        node bin/dev.js monkey -i 1800-1800 -r https://5b4522f4.mariansopsoraj.myterminus.com -a 1000-1000 -p $PRIVATE_KEY -s $SOLANA_PRIVATE_KEY -t "succeed" -C true -n mainnet -T 0x28623BF8E872FFAE6e2955a176dFCd10B97a09b3 -S 0x5c48523b82474e6a95e2fd4afc64deb470d1239d997d38ea332227eef84107dd -w http://n8n.edge-dev.xyz/webhook/f8b3f611-89b9-4128-8e93-b50ff7003530 -b "" -c "{\"polygon\": \"https://polygon-rpc.com\"}" -l "ballgcolin.myterminus.com" -d true >> "$log_file" 2>&1
        
        echo "Monkey_mainnet application exited with code $?. Restarting..." >> "$log_file"
        sleep 1
    fi
    
done