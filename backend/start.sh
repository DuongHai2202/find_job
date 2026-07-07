#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROFILE="${SPRING_PROFILES_ACTIVE:-${1:-dev}}"

if [[ -d "/c/Program Files/Java/jdk-21" ]]; then
  export JAVA_HOME="/c/Program Files/Java/jdk-21"
  export PATH="$JAVA_HOME/bin:$PATH"
elif [[ -d "/mnt/c/Program Files/Java/jdk-21" ]]; then
  export JAVA_HOME="/mnt/c/Program Files/Java/jdk-21"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

if [[ -z "${JAVA_HOME:-}" || ! -x "${JAVA_HOME}/bin/java" ]]; then
  echo "[ERROR] Khong tim thay Java. Can cai JDK 21 va set JAVA_HOME dung."
  exit 1
fi

if [[ ! -f "${JAVA_HOME}/release" ]] || ! grep -q 'JAVA_VERSION="21' "${JAVA_HOME}/release"; then
  echo "[ERROR] Backend nay can JDK 21. JAVA_HOME hien tai: ${JAVA_HOME}"
  echo "[HINT] Cai dat JDK 21 hoac sua JAVA_HOME ve dung thu muc JDK 21."
  exit 1
fi

echo "Starting backend with profile: $PROFILE"
./mvnw spring-boot:run "-Dspring-boot.run.profiles=$PROFILE"
