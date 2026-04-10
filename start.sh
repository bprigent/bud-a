#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

# Ensure data directory exists (CSVs are created by the backend on first access)
mkdir -p "$DIR/data/images/bank-logos"

# Ensure .env files exist — copy from .env.example if missing
# First-time setup: create .env files and ask for default currency
if [ ! -f "$DIR/backend/.env" ] || [ ! -f "$DIR/frontend/.env" ]; then
  echo ""
  echo "First-time setup detected!"
  read -p "Enter your default currency code (e.g. EUR, USD, GBP) [EUR]: " CURRENCY
  CURRENCY="${CURRENCY:-EUR}"
  CURRENCY="$(echo "$CURRENCY" | tr '[:lower:]' '[:upper:]')"
  echo "Using $CURRENCY as default currency."
  echo ""

  if [ ! -f "$DIR/backend/.env" ]; then
    if [ -f "$DIR/backend/.env.example" ]; then
      sed "s/DEFAULT_CURRENCY=.*/DEFAULT_CURRENCY=$CURRENCY/" "$DIR/backend/.env.example" > "$DIR/backend/.env"
      echo "Created backend/.env with currency $CURRENCY."
    else
      echo "Warning: backend/.env is missing and no .env.example found."
    fi
  fi

  if [ ! -f "$DIR/frontend/.env" ]; then
    if [ -f "$DIR/frontend/.env.example" ]; then
      sed "s/VITE_DEFAULT_CURRENCY=.*/VITE_DEFAULT_CURRENCY=$CURRENCY/" "$DIR/frontend/.env.example" > "$DIR/frontend/.env"
      echo "Created frontend/.env with currency $CURRENCY."
    else
      echo "Warning: frontend/.env is missing and no .env.example found."
    fi
  fi
fi

# Cleanup on exit — kill both servers
cleanup() {
  echo ""
  echo "Shutting down..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

# Install backend dependencies if needed
echo "Setting up backend..."
cd "$DIR/backend"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt

# Install frontend dependencies if needed
echo "Setting up frontend..."
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi

# Start backend
echo "Starting backend on http://localhost:8000..."
cd "$DIR/backend"
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to be ready
sleep 2

# Start frontend
echo "Starting frontend on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Bud-A is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  Press Ctrl+C to stop."
echo ""

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
